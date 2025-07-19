from datetime import date

from flask import Blueprint, jsonify, request
from sqlalchemy import func

from app import db
from app.models import PartnerPreference, User, Like, Dislike, Match
from app.utils.access_utils import login_required_api, api_error
from app.utils.likes_utils import available_to_act

discover_bp = Blueprint('discover', __name__)


@discover_bp.route('/user', methods=['GET'])
@login_required_api
def get_user():
    user_id = request.args.get('user_id')

    if not user_id:
        return api_error("User id was not specified.", 400)

    includes = request.args.get('includes')
    include_list = includes.split(',') if includes else None

    user = User.query.filter_by(user_id=user_id).first_or_404()
    return jsonify(user.to_dict(include_list))


@discover_bp.route('/users', methods=['GET'])
@login_required_api
def discover():
    creds = discover.cred
    user = creds.user
    today = date.today()

    prefs = PartnerPreference.query.filter_by(user_id=user.user_id).first()

    liked_subquery = db.session.query(Like.to_user_id).filter(Like.from_user_id == user.user_id)
    disliked_subquery = db.session.query(Dislike.to_user_id).filter(Dislike.from_user_id == user.user_id)

    query = User.query.filter(
        User.user_id != user.user_id,
        User.is_active == True,
        ~User.user_id.in_(liked_subquery),
        ~User.user_id.in_(disliked_subquery)
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
    sort_query = User.get_user_sort_query(sort)

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    pagination = query.order_by(sort_query).paginate(page=page, per_page=per_page, error_out=False)
    suitable_users = pagination.items

    includes = request.args.get('includes')
    include_list = includes.split(',') if includes else None

    users_data = [u.to_dict(include_list) for u in suitable_users]

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
    user = like.cred.user

    data = request.get_json()
    to_user_id = data.get('to_user_id')

    if not available_to_act(user.user_id, to_user_id):
        return api_error("User already liked / disliked this user.", 409)

    new_like = Like(
        from_user_id=user.user_id,
        to_user_id=to_user_id
    )

    reply_like = Like.query.filter_by(from_user_id=to_user_id, to_user_id=user.user_id).first()
    if reply_like:
        new_match = Match(
            user1_id=to_user_id,
            user2_id=user.user_id,
        )
        db.session.add(new_match)

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


@discover_bp.route('/clear-dislikes', methods=['DELETE'])
@login_required_api
def clear_dislikes():
    user = clear_dislikes.cred.user

    Dislike.query.filter_by(from_user_id=user.user_id).delete()
    db.session.commit()

    return "ok"


@discover_bp.route('/clear-likes', methods=['DELETE'])
@login_required_api
def clear_likes():
    user = clear_likes.cred.user

    Like.query.filter_by(from_user_id=user.user_id).delete()
    db.session.commit()

    return "ok"


@discover_bp.route('/clear-like/<int:like_id>', methods=['DELETE'])
@login_required_api
def clear_like(like_id):
    Like.query.filter_by(id=like_id).delete()
    db.session.commit()

    return "ok"
