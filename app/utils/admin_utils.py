from datetime import datetime, timedelta, date
from operator import or_, and_

from flask import request, jsonify
from sqlalchemy import extract, func, distinct, case

from app.database import db
from app.models import User, Meeting, Like, Dislike, MeetingFeedback, Refusal, Match, Gender, ZodiacSign


def get_quarterly_clients():
    current_year = datetime.now().year

    quarters = db.session.query(
        func.ceil(extract('month', User.registration_date) / 3).label('quarter')
    ).filter(
        extract('year', User.registration_date) == current_year
    ).distinct().all()

    results = []
    for (quarter,) in quarters:
        registered_count = db.session.query(User).filter(
            extract('year', User.registration_date) == current_year,
            func.ceil(extract('month', User.registration_date) / 3) == quarter
        ).count()

        active_like_users = db.session.query(distinct(Like.from_user_id)).filter(
            extract('year', Like.created_at) == current_year,
            func.ceil(extract('month', Like.created_at) / 3) == quarter
        )

        active_dislike_users = db.session.query(distinct(Dislike.from_user_id)).filter(
            extract('year', Dislike.created_at) == current_year,
            func.ceil(extract('month', Dislike.created_at) / 3) == quarter
        )

        active_users = set([u[0] for u in active_like_users.union(active_dislike_users).all()])

        results.append({
            "quarter": int(quarter),
            "registered_count": registered_count,
            "active_users_count": len(active_users)
        })
    return results


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


def get_planned_meetings():
    today = datetime.now()
    next_month = today.replace(day=1) + timedelta(days=32)
    next_month = next_month.replace(day=1)

    meetings = Meeting.query.filter(
        Meeting.meeting_date >= today,
        Meeting.meeting_date < next_month + timedelta(days=31),
        Meeting.archived == False
    ).all()
    return [m.to_dict() for m in meetings]


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


def get_attendance_by_gender():
    # 1. Беремо всі фідбеки з partner_late=True
    late_feedbacks = db.session.query(MeetingFeedback).filter_by(partner_late=True).all()

    # 2. Визначаємо user_id, які пропускали зустрічі
    skipped_user_ids = set()
    for fb in late_feedbacks:
        meeting = fb.meeting
        # partner_id = той, хто НЕ залишав фідбек
        partner_id = meeting.user1_id if fb.user_id != meeting.user1_id else meeting.user2_id
        skipped_user_ids.add(partner_id)

    # 3. Беремо всі унікальні user_id, які були на мітах
    all_meetings = db.session.query(Meeting.user1_id, Meeting.user2_id).all()
    all_user_ids = set()
    for u1, u2 in all_meetings:
        all_user_ids.add(u1)
        all_user_ids.add(u2)

    # 4. Вилучаємо тих, хто пропускав зустрічі
    attended_user_ids = all_user_ids - skipped_user_ids

    # 5. Беремо дані про юзерів та групуємо по гендеру
    users = db.session.query(User).filter(User.user_id.in_(attended_user_ids)).all()
    attendance_by_gender = {}
    for user in users:
        gender_name = user.gender_obj.name
        if gender_name not in attendance_by_gender:
            attendance_by_gender[gender_name] = []
        attendance_by_gender[gender_name].append(user.to_dict(["gender"]))

    return attendance_by_gender


def get_refusal_count():
    return str(Refusal.query.count())


def get_successful_couples():
    users = db.session.query(distinct(MeetingFeedback.user_id)).filter(
        MeetingFeedback.stay_together == True
    ).all()
    return str(len(users))


def get_conducted_meetings_by_gender():
    q = db.session.query(
        User.gender,
        func.count(MeetingFeedback.feedback_id).label('conducted_count')
    ).join(MeetingFeedback, User.user_id == MeetingFeedback.user_id) \
        .filter(MeetingFeedback.partner_late == False) \
        .group_by(User.gender).all()

    return {Gender.query.get(gender).name: count for gender, count in q}


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
        zodiac: count
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
        weekday = weekdays[d.weekday()]
        result[weekday] = registrations_dict.get(d, 0)

    return result


def paginate_query(query, serializer, default_per_page=10):
    """
    Універсальний хелпер для пагінації.

    :param query: SQLAlchemy query (наприклад User.query)
    :param serializer: функція або lambda для перетворення item -> dict
    :param default_per_page: кількість елементів на сторінці
    """
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", default_per_page, type=int)

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "total": pagination.total,
        "page": pagination.page,
        "pages": pagination.pages,
        "items": [serializer(item) for item in pagination.items]
    })
