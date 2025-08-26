from datetime import date

from flask import Blueprint, jsonify, request
from sqlalchemy import func, desc, case

from app import db
from app.models import PartnerPreference, User, Like, Dislike, Match, Interest, UserInterest
from app.utils.access_utils import login_required_api, api_error
from app.utils.likes_utils import available_to_act
from app.utils.user_utils import build_discover_query, get_user_sort_query

discover_bp = Blueprint('discover', __name__)


@discover_bp.route('/users', methods=['GET'])
@login_required_api
def discover():
    creds = discover.cred
    user = creds.user
    query, prefs = build_discover_query(user, include_likes=True)

    sort = request.args.get("sort", "-id", type=str)
    sort_query = get_user_sort_query(sort)

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    pagination = query.order_by(sort_query).paginate(page=page, per_page=per_page, error_out=False)

    includes = request.args.get('includes')
    include_list = includes.split(',') if includes else None

    users_data = [u[0].to_dict(include_list) for u in pagination.items]

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


@discover_bp.route('/candidates-count', methods=['GET'])
@login_required_api
def candidates_count():
    creds = discover.cred
    user = creds.user
    query, _ = build_discover_query(user, include_likes=False)
    total_count = query.count()
    return str(total_count)


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

    return jsonify({
        "status": "ok",
        "match": True if reply_like else False
    })


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

    # Отримуємо ID всіх користувачів, з якими є матч
    matched_user_ids = db.session.query(Match.user1_id).filter(Match.user2_id == user.user_id).union(
        db.session.query(Match.user2_id).filter(Match.user1_id == user.user_id)
    ).subquery()

    # Видаляємо лайки тільки тих користувачів, з якими ще немає матчу
    Like.query.filter(
        Like.from_user_id == user.user_id,
        ~Like.to_user_id.in_(matched_user_ids)
    ).delete(synchronize_session=False)

    db.session.commit()

    return "ok"


@discover_bp.route('/clear-like/<int:like_id>', methods=['DELETE'])
@login_required_api
def clear_like(like_id):
    # Знаходимо лайк
    user_like = Like.query.get(like_id)
    if not user_like:
        return api_error("Like not found", 404)

    from_user = user_like.from_user_id
    to_user = user_like.to_user_id

    # Видаляємо лайк
    db.session.delete(user_like)

    # Видаляємо матч, якщо він існує
    match = Match.query.filter(
        ((Match.user1_id == from_user) & (Match.user2_id == to_user)) |
        ((Match.user1_id == to_user) & (Match.user2_id == from_user))
    ).first()

    if match:
        db.session.delete(match)

    db.session.commit()
    return "ok"


@discover_bp.route('/clear-dislike/<int:dislike_id>', methods=['DELETE'])
@login_required_api
def clear_dislike(dislike_id):
    Dislike.query.filter_by(id=dislike_id).delete()
    db.session.commit()

    return "ok"


@discover_bp.route('/like-count', methods=['GET'])
@login_required_api
def like_count():
    user = like_count.cred.user
    likes = Like.query.filter_by(from_user_id=user.user_id).all()
    return str(len(likes))


@discover_bp.route('/dislike-count', methods=['GET'])
@login_required_api
def dislike_count():
    user = dislike_count.cred.user
    dislikes = Dislike.query.filter_by(from_user_id=user.user_id).all()
    return str(len(dislikes))
