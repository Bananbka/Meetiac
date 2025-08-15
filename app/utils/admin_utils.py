from datetime import datetime, timedelta, date
from operator import or_

from sqlalchemy import extract, func, distinct

from app.database import db
from app.models import User, Meeting, Like, Dislike, MeetingFeedback, Refusal, Match, Gender


# 1
def get_quarterly_clients():
    """Повертає список клієнтів за кварталами року з кількістю зареєстрованих та активних."""
    # Знайдемо всі квартали з реєстрацій
    quarters = db.session.query(
        extract('year', User.registration_date).label('year'),
        func.ceil(extract('month', User.registration_date) / 3).label('quarter')
    ).distinct().all()

    results = []
    for year, quarter in quarters:
        registered_count = db.session.query(User).filter(
            extract('year', User.registration_date) == year,
            func.ceil(extract('month', User.registration_date) / 3) == quarter
        ).count()

        active_like_users = db.session.query(distinct(Like.from_user_id)).filter(
            extract('year', Like.created_at) == year,
            func.ceil(extract('month', Like.created_at) / 3) == quarter
        )

        active_dislike_users = db.session.query(distinct(Dislike.from_user_id)).filter(
            extract('year', Dislike.created_at) == year,
            func.ceil(extract('month', Dislike.created_at) / 3) == quarter
        )

        active_users = set([u[0] for u in active_like_users.union(active_dislike_users).all()])

        results.append({
            "year": int(year),
            "quarter": int(quarter),
            "registered_count": registered_count,
            "active_users_count": len(active_users)
        })
    return results


# 2
def get_successful_couples_info():
    """
    Повертає список успішних зустрічей (stay_together=True) з інформацією про зустріч
    та саму пару з таблиці Match.
    """
    feedbacks = MeetingFeedback.query.filter(MeetingFeedback.stay_together == True).all()
    results = []

    for fb in feedbacks:
        meeting = Meeting.query.get(fb.meeting_id)
        if not meeting:
            continue

        # Знаходимо відповідний матч для пари (user1_id/user2_id можуть бути в будь-якому порядку)
        match = Match.query.filter(
            or_(
                (Match.user1_id == meeting.user1_id) & (Match.user2_id == meeting.user2_id),
                (Match.user1_id == meeting.user2_id) & (Match.user2_id == meeting.user1_id)
            )
        ).first()

        if match:
            match_info = match.to_dict()
        else:
            match_info = None

        results.append({
            "meeting": {
                "meeting_id": meeting.meeting_id,
                "meeting_date": meeting.meeting_date,
                "location": meeting.location,
                "result": meeting.result,
                "archived": meeting.archived,
                "feedback_id": fb.feedback_id,
                "stay_together": fb.stay_together,
                "was_successful": fb.was_successful,
                "comment": fb.comment,
                "partner_late": fb.partner_late,
                "created_at": fb.created_at
            },
            "match": match_info
        })

    return results


# 3
def get_planned_meetings():
    today = datetime.now()
    next_month = today.replace(day=1) + timedelta(days=32)
    next_month = next_month.replace(day=1)

    meetings = Meeting.query.filter(
        Meeting.meeting_date >= today,
        Meeting.meeting_date < next_month + timedelta(days=31)
    ).all()
    return [m.to_dict() for m in meetings]


# 4
def get_recent_registrations():
    today = date.today()
    last_month = today.replace(day=1) - timedelta(days=1)
    six_months_ago = today - timedelta(days=182)

    last_month_count = User.query.filter(
        User.registration_date >= last_month.replace(day=1),
        User.registration_date <= last_month
    ).count()

    six_months_count = User.query.filter(
        User.registration_date >= six_months_ago
    ).count()

    return {"last_month": last_month_count, "last_6_months": six_months_count}


# 5
def get_attendance_by_gender():
    q = db.session.query(
        User.gender,
        func.count(MeetingFeedback.feedback_id).label('attended_count')
    ).join(MeetingFeedback, User.user_id == MeetingFeedback.user_id) \
        .filter(MeetingFeedback.partner_late == False) \
        .group_by(User.gender).all()

    return {Gender.query.get(gender).name: count for gender, count in q}


# 6
#

# 7
def get_refusal_count():
    return Refusal.query.count()


# 8
#

# 9
def get_successful_couples():
    """Повертає унікальних користувачів, які вирішили сімейні проблеми."""
    users = db.session.query(distinct(MeetingFeedback.user_id)).filter(
        MeetingFeedback.stay_together == True
    ).all()
    return len(users)


# 10
def get_conducted_meetings_by_gender():
    q = db.session.query(
        User.gender,
        func.count(MeetingFeedback.feedback_id).label('conducted_count')
    ).join(MeetingFeedback, User.user_id == MeetingFeedback.user_id) \
        .filter(MeetingFeedback.partner_late == False) \
        .group_by(User.gender).all()

    return {Gender.query.get(gender).name: count for gender, count in q}

