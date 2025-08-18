from datetime import datetime, timedelta, date
from operator import or_

from sqlalchemy import extract, func, distinct

from app.database import db
from app.models import User, Meeting, Like, Dislike, MeetingFeedback, Refusal, Match, Gender, ZodiacSign


# 1
def get_quarterly_clients():
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
    feedbacks = MeetingFeedback.query.filter(MeetingFeedback.stay_together == True).all()
    results = []

    for fb in feedbacks:
        meeting = Meeting.query.get(fb.meeting_id)
        if not meeting:
            continue

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


# 7
def get_refusal_count():
    return Refusal.query.count()


# 9
def get_successful_couples():
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


# Далі уже нормальні функції для себе, а не для умови курсової
def get_user_stats():
    today = date.today()

    total_users = db.session.query(func.count(User.user_id)) \
        .filter(User.is_active.is_(True)) \
        .scalar()

    active_users_today = db.session.query(func.count(func.distinct(User.user_id))) \
        .outerjoin(Like, Like.from_user_id == User.user_id) \
        .outerjoin(Dislike, Dislike.from_user_id == User.user_id) \
        .filter(User.is_active.is_(True)) \
        .filter(
        or_(
            func.date(Like.created_at) == today,
            func.date(Dislike.created_at) == today
        )
    ) \
        .scalar()

    active_users_month = db.session.query(func.count(func.distinct(User.user_id))) \
        .outerjoin(Like, Like.from_user_id == User.user_id) \
        .outerjoin(Dislike, Dislike.from_user_id == User.user_id) \
        .filter(User.is_active.is_(True)) \
        .filter(
        or_(
            (extract('year', Like.created_at) == today.year) & (extract('month', Like.created_at) == today.month),
            (extract('year', Dislike.created_at) == today.year) & (extract('month', Dislike.created_at) == today.month)
        )
    ) \
        .scalar()

    return {
        "total_users": total_users,
        "active_users_today": active_users_today,
        "active_users_month": active_users_month
    }


def get_match_stats():
    today = date.today()

    total_matches = db.session.query(func.count(Match.match_id)) \
        .filter(Match.archived.is_(False)) \
        .scalar()

    today_matches = db.session.query(func.count(Match.match_id)) \
        .filter(Match.archived.is_(False)) \
        .filter(func.date(Match.created_at) == today) \
        .scalar()

    return {
        "total_matches": total_matches,
        "today_matches": today_matches
    }


def get_zodiac_stats():
    total = db.session.query(func.count(User.user_id)) \
        .filter(User.is_active.is_(True)) \
        .scalar()

    if total == 0:
        return {}

    zodiac_counts = (
        db.session.query(
            ZodiacSign.name,
            func.count(User.user_id)
        )
        .join(User, User.sign_id == ZodiacSign.sign_id)
        .filter(User.is_active.is_(True))
        .group_by(ZodiacSign.name)
        .all()
    )

    distribution = {
        zodiac: {
            "percent": round(count / total * 100, 2),
            "count": count
        }
        for zodiac, count in zodiac_counts
    }

    return distribution


def get_registrations_last_week():
    today = date.today()
    week_ago = today - timedelta(days=6)

    registrations = (
        db.session.query(
            func.date(User.registration_date),
            func.count(User.user_id)
        )
        .filter(User.is_active.is_(True))
        .filter(User.registration_date >= week_ago)
        .group_by(func.date(User.registration_date))
        .all()
    )

    registrations_dict = {day: count for day, count in registrations}

    weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"]

    result = {}
    for i in range(7):
        d = week_ago + timedelta(days=i)
        weekday = weekdays[d.weekday()]  # 0=Пн ... 6=Нд
        result[weekday] = registrations_dict.get(d, 0)

    return result
