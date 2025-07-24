from datetime import datetime

from flask import Blueprint, request, jsonify

from app import db
from app.models import Meeting
from app.utils.access_utils import login_required_api, api_error

meeting_bp = Blueprint('meeting', __name__)


@meeting_bp.route('/', methods=['PUT'])
@login_required_api
def create_meeting():
    user_id = create_meeting.cred.user.user_id

    data = request.get_json()
    meeting_date = datetime.strptime(data.get("datetime"), "%Y-%m-%dT%H:%M")

    new_meeting = Meeting(
        user1_id=user_id,
        user2_id=data.get("user2_id"),
        meeting_date=meeting_date,
        location=data.get("location")
    )

    db.session.add(new_meeting)
    db.session.commit()
    return jsonify(new_meeting.to_dict())


@meeting_bp.route('/count', methods=['GET'])
@login_required_api
def meeting_count():
    user = meeting_count.cred.user
    meetings_count = Meeting.query.filter(
        (Meeting.archived == False) &
        ((Meeting.user1_id == user.user_id) | (Meeting.user2_id == user.user_id))
    ).count()

    return str(meetings_count)


@meeting_bp.route('/meetings', methods=['GET'])
@login_required_api
def get_meetings():
    user = get_meetings.cred.user

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    users_matches_query = Meeting.query.filter(
        (Meeting.archived == False) &
        ((Meeting.user1_id == user.user_id) | (Meeting.user2_id == user.user_id))
    )

    pagination = users_matches_query.paginate(page=page, per_page=per_page, error_out=False)

    data = [match.to_dict(user.user_id) for match in pagination.items]

    return jsonify({
        "meetings": data,
        "pagination": {
            "page": pagination.page,
            "per_page": pagination.per_page,
            "pages": pagination.pages,
            "total": pagination.total,
            "has_next": pagination.has_next,
            "has_prev": pagination.has_prev
        }
    })


@meeting_bp.route('/comment/<int:meeting_id>', methods=['POST'])
@login_required_api
def comment_meeting(meeting_id):
    user = comment_meeting.cred.user

    data = request.get_json()
    comment = data.get('comment')

    if comment is None:
        return api_error("Comment has not been provided.", 400)

    meeting = Meeting.query.get(meeting_id)

    is_user1, is_user2 = user.user_id == meeting.user1_id, user.user_id == meeting.user2_id
    if not any([is_user1, is_user2]):
        return api_error("User doesn't have permission to comment this meeting.", 400)

    if is_user1:
        meeting.user1_comment = comment
    elif is_user2:
        meeting.user2_comment = comment
    else:
        return api_error("Unknown user", 400)

    db.session.commit()

    return "ok"
