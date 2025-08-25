from flask import Blueprint, jsonify, request

from app import db
from app.models import Match, Like, User
from app.utils.access_utils import login_required_api, api_error, admin_access_required_api
from app.utils.admin_utils import paginate_query

match_bp = Blueprint('match', __name__)


@match_bp.route('/count', methods=['GET'])
@login_required_api
def match_count():
    user = match_count.cred.user
    matches_count = Match.query.filter(
        (Match.archived == False) &
        ((Match.user1_id == user.user_id) | (Match.user2_id == user.user_id))
    ).count()

    return str(matches_count)


@match_bp.route('/matches', methods=['GET'])
@login_required_api
def get_matches():
    user = get_matches.cred.user

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    users_matches_query = Match.query.filter(
        (Match.archived == False) &
        ((Match.user1_id == user.user_id) | (Match.user2_id == user.user_id))
    )

    pagination = users_matches_query.paginate(page=page, per_page=per_page, error_out=False)

    data = [match.to_dict(user.user_id) for match in pagination.items]

    return jsonify({
        "matches": data,
        "pagination": {
            "page": pagination.page,
            "per_page": pagination.per_page,
            "pages": pagination.pages,
            "total": pagination.total,
            "has_next": pagination.has_next,
            "has_prev": pagination.has_prev
        }
    })


@match_bp.route('/<int:match_id>', methods=['DELETE'])
@login_required_api
def delete_match(match_id):
    user_id = delete_match.cred.user.user_id

    match = Match.query.get(match_id)

    if match.archived:
        return api_error("This match is archived.", 400)

    user1_id = match.user1_id
    user2_id = match.user2_id

    if user_id != user1_id and user_id != user2_id:
        return api_error("User has no permission", 404)

    Like.query.filter(
        db.or_(
            db.and_(Like.from_user_id == user1_id, Like.to_user_id == user2_id),
            db.and_(Like.from_user_id == user2_id, Like.to_user_id == user1_id)
        )
    ).delete()

    db.session.delete(match)
    db.session.commit()

    return "ok"


@match_bp.route('/a/<int:match_id>', methods=['DELETE'])
@login_required_api
@admin_access_required_api
def delete_match_admin(match_id):
    match = Match.query.get_or_404(match_id)
    db.session.delete(match)
    db.session.commit()
    return "ok"


@match_bp.route('/<int:match_id>', methods=['POST'])
@login_required_api
@admin_access_required_api
def update_match(match_id):
    match = Match.query.get_or_404(match_id)
    data = request.json or {}

    if "comment" in data:
        match.comment = data["comment"]
    if "archived" in data:
        match.archived = bool(data["archived"])
    if "user1_id" in data:
        user1 = User.query.get(data["user1_id"])
        if not user1:
            return api_error(f"User with id {data['user1_id']} not found", 404)
        match.user1_id = data["user1_id"]
    if "user2_id" in data:
        user2 = User.query.get(data["user2_id"])
        if not user2:
            return api_error(f"User with id {data['user2_id']} not found", 404)
        match.user2_id = data["user2_id"]
    if match.user1_id == match.user2_id:
        return api_error("user1_id and user2_id cannot be the same", 400)

    db.session.commit()
    return jsonify({"message": "Match updated", "match": match.to_dict()})


@match_bp.route('/', methods=['GET'])
@login_required_api
@admin_access_required_api
def get_admin_matches():
    return paginate_query(Match.query, lambda m: m.to_dict())
