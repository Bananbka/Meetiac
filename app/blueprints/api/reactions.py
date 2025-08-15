from flask import Blueprint, request, jsonify

from app.models import Like, Dislike, User
from app.utils.access_utils import login_required_api
from app.utils.user_utils import get_user_sort_query

reaction_bp = Blueprint('reactions', __name__)


@reaction_bp.route('/likes', methods=['GET'])
@login_required_api
def likes():
    user = likes.cred.user

    sort_param = request.args.get("sort", "-id")
    sort_query = get_user_sort_query(sort_param)

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    pagination = (
        Like.query
        .filter_by(from_user_id=user.user_id)
        .join(User, User.user_id == Like.to_user_id)
        .order_by(sort_query)
        .paginate(page=page, per_page=per_page, error_out=False)
    )

    like_data = [like.to_dict() for like in pagination.items]

    return jsonify({
        "likes": like_data,
        "pagination": {
            "page": pagination.page,
            "per_page": pagination.per_page,
            "pages": pagination.pages,
            "total": pagination.total,
            "has_next": pagination.has_next,
            "has_prev": pagination.has_prev
        }
    })


@reaction_bp.route('/dislikes', methods=['GET'])
@login_required_api
def dislikes():
    user = dislikes.cred.user

    sort_param = request.args.get("sort", "-id")
    sort_query = get_user_sort_query(sort_param)

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    pagination = (
        Dislike.query
        .filter_by(from_user_id=user.user_id)
        .join(User, User.user_id == Dislike.to_user_id)
        .order_by(sort_query)
        .paginate(page=page, per_page=per_page, error_out=False)
    )

    dislike_data = [dislike.to_dict() for dislike in pagination.items]

    return jsonify({
        "dislikes": dislike_data,
        "pagination": {
            "page": pagination.page,
            "per_page": pagination.per_page,
            "pages": pagination.pages,
            "total": pagination.total,
            "has_next": pagination.has_next,
            "has_prev": pagination.has_prev
        }
    })
