from datetime import date

from sqlalchemy import func, case, desc

from app.database import db
from app.models import User, PartnerPreference, Like, Dislike, Interest, UserInterest


def get_user_sort_query(sort_param: str):
    is_desc = sort_param.startswith("-")
    sort_by = sort_param[1:] if is_desc else sort_param

    if sort_by == "height":
        sort_query = User.height.desc() if is_desc else User.height.asc()
    elif sort_by == "weight":
        sort_query = User.weight.desc() if is_desc else User.weight.asc()
    elif sort_by == "age":
        sort_query = User.birth_date.asc() if is_desc else User.birth_date.desc()  # реверс
    elif sort_by == "id":
        sort_query = User.user_id.desc() if is_desc else User.user_id.asc()
    elif sort_by == "shuffle":
        sort_query = func.random()
    else:
        sort_query = User.user_id.desc() if is_desc else User.user_id.asc()

    return sort_query


def build_discover_query(user, include_likes=True):
    today = date.today()
    prefs = PartnerPreference.query.filter_by(user_id=user.user_id).first()

    query = User.query.filter(
        User.user_id != user.user_id,
        User.is_active == True,
    )

    if include_likes:
        liked_subquery = db.session.query(Like.to_user_id).filter(Like.from_user_id == user.user_id)
        disliked_subquery = db.session.query(Dislike.to_user_id).filter(Dislike.from_user_id == user.user_id)
        query = query.filter(~User.user_id.in_(liked_subquery), ~User.user_id.in_(disliked_subquery))

    if prefs:
        if prefs.gender_obj.name != "any":
            query = query.filter(User.gender == prefs.gender_id)

        if prefs.min_age is not None:
            max_birth = date(today.year - prefs.min_age, today.month, today.day)
            query = query.filter(User.birth_date <= max_birth)

        if prefs.max_age is not None:
            min_birth = date(today.year - prefs.max_age, today.month, today.day)
            query = query.filter(User.birth_date >= min_birth)

        if prefs.min_height is not None:
            query = query.filter(User.height >= prefs.min_height)
        if prefs.max_height is not None:
            query = query.filter(User.height <= prefs.max_height)
        if prefs.min_weight is not None:
            query = query.filter(User.weight >= prefs.min_weight)
        if prefs.max_weight is not None:
            query = query.filter(User.weight <= prefs.max_weight)

        if prefs.zodiac_signs:
            zodiac_ids = [z.sign_id for z in prefs.zodiac_signs]
            query = query.filter(User.sign_id.in_(zodiac_ids))

        if prefs.interests:
            interest_ids = [i.interest_id for i in prefs.interests]
            match_case = case((Interest.interest_id.in_(interest_ids), 1), else_=0)
            query = (
                query
                .outerjoin(UserInterest, User.user_id == UserInterest.user_id)
                .outerjoin(Interest, Interest.interest_id == UserInterest.interest_id)
                .group_by(User.user_id)
                .add_columns(func.sum(match_case).label("match_count"))
                .order_by(desc("match_count"))
            )

    return query, prefs
