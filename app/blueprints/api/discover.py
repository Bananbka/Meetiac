from datetime import date

from flask import Blueprint, jsonify, request

from app import db
from app.models import PartnerPreference, User, Like, Dislike
from app.utils.access_utils import login_required_api, api_error
from app.utils.likes_utils import available_to_act

discover_bp = Blueprint('discover', __name__)


@discover_bp.route('/users', methods=['GET'])
@login_required_api
def discover():
    creds = discover.cred
    user = creds.user
    today = date.today()

    prefs = PartnerPreference.query.filter_by(user_id=user.user_id).first()

    query = User.query.filter(
        User.user_id != user.user_id,
        User.is_active == True
    )

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

    sort = request.args.get("sort", "-id", type=str)
    is_desc = sort.startswith("-")
    sort_by = sort[1:] if is_desc else sort

    if sort_by == "height":
        sort_query = User.height.desc() if is_desc else User.height.asc()
    elif sort_by == "weight":
        sort_query = User.weight.desc() if is_desc else User.weight.asc()
    elif sort_by == "age":
        sort_query = User.birth_date.asc() if is_desc else User.birth_date.desc()  # реверс через дати
    elif sort_by == "id":
        sort_query = User.user_id.desc() if is_desc else User.user_id.asc()
    else:
        sort_query = User.user_id.desc() if is_desc else User.user_id.asc()

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    pagination = query.order_by(sort_query).paginate(page=page, per_page=per_page, error_out=False)
    suitable_users = pagination.items

    users_data = [{
        "id": u.user_id,
        "name": f"{u.first_name} {u.last_name}",
        "age": today.year - u.birth_date.year,
        "gender": u.gender_obj.name,
        "sign": u.zodiac_sign.name
        # ДОДАТИ ІНФУ ПРО ЗЗ І СУМІСНІСТЬ
    } for u in suitable_users]

    return jsonify({
        "users": users_data,
        "pagination": {
            "page": pagination.page,
            "per_page": pagination.per_page,
            "pages": pagination.pages,
            "total": pagination.total,
            "has_next": pagination.has_next,
            "has_prev": pagination.has_prev
        }
    })


@discover_bp.route('/like', methods=['PUT'])
@login_required_api
def like():
    user = dislike.cred.user

    data = request.get_json()
    to_user_id = data.get('to_user_id')

    if not available_to_act(user.user_id, to_user_id):
        return api_error("User already liked / disliked this user.", 409)

    new_like = Like(
        from_user_id=user.user_id,
        to_user_id=to_user_id
    )

    db.session.add(new_like)
    db.session.commit()

    return "ok"


@discover_bp.route('/dislike', methods=['PUT'])
@login_required_api
def dislike():
    user = dislike.cred.user

    data = request.get_json()
    to_user_id = data.get('to_user_id')

    if not available_to_act(user.user_id, to_user_id):
        return api_error("User already liked / disliked this user.", 409)

    new_dislike = Dislike(
        from_user_id=user.user_id,
        to_user_id=to_user_id
    )

    db.session.add(new_dislike)
    db.session.commit()

    return "ok"


@discover_bp.route('/clear-votes', methods=['DELETE'])
@login_required_api
def clear_votes():
    user = clear_votes.cred.user

    Like.query.filter_by(from_user_id=user.user_id).delete()
    Dislike.query.filter_by(from_user_id=user.user_id).delete()
    db.session.commit()

    return "ok"
