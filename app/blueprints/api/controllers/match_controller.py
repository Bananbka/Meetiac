from flask import Blueprint, jsonify

from app import db
from app.models import Match, Like
from app.utils.access_utils import login_required_api, api_error

match_bp = Blueprint('match', __name__)


@match_bp.route('/count', methods=['GET'])
@login_required_api
def match_count():
    user = match_count.cred.user
    matches_count = Match.query.filter(
        (Match.user1_id == user.user_id) | (Match.user2_id == user.user_id)
    ).count()

    return str(matches_count)


@match_bp.route('/matches', methods=['GET'])
@login_required_api
def get_matches():
    user = get_matches.cred.user
    users_matches = Match.query.filter(
        (Match.archived == False) & ((Match.user1_id == user.user_id) | (Match.user2_id == user.user_id))
    )

    data = [m.to_dict() for m in users_matches]
    return jsonify(data)


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
