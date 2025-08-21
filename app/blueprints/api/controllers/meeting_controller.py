from datetime import datetime

from flask import Blueprint, request, jsonify

from app import db
from app.models import Meeting, MeetingFeedback, User
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
        ((Meeting.user1_id == user.user_id) | (Meeting.user2_id == user.user_id))
    ).order_by(Meeting.meeting_date.desc())

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

    if not meeting.is_user_belong(user.user_id):
        return api_error("User doesn't have permission to comment this meeting.", 400)

    is_user1, is_user2 = user.user_id == meeting.user1_id, user.user_id == meeting.user2_id
    if is_user1:
        meeting.user1_comment = comment
    elif is_user2:
        meeting.user2_comment = comment
    else:
        return api_error("Unknown user", 400)

    db.session.commit()

    return "ok"


@meeting_bp.route('/archive/<int:meeting_id>', methods=['PATCH'])
@login_required_api
def send_meeting_to_archive(meeting_id):
    user = send_meeting_to_archive.cred.user

    meeting = Meeting.query.get(meeting_id)
    if not meeting.is_user_belong(user.user_id):
        return api_error("User doesn't have permission to comment this meeting.", 400)

    if meeting.archived:
        return "ok"

    meeting.archived = True
    db.session.commit()
    return "ok"


@meeting_bp.route('/<int:meeting_id>', methods=['GET'])
@login_required_api
def get_meeting(meeting_id):
    user_id = get_meeting.cred.user.user_id

    meeting = Meeting.query.get(meeting_id)

    if not meeting or not meeting.is_user_belong(user_id):
        return api_error("User has no permission to view this meeting.", 400)

    return meeting.to_dict(user_id)


@meeting_bp.route('/feedback/<int:meeting_id>', methods=['POST'])
@login_required_api
def feedback_meeting(meeting_id):
    user_id = feedback_meeting.cred.user.user_id

    meeting = Meeting.query.get(meeting_id)
    if not meeting:
        return api_error("Meeting doesn't exist.", 404)

    if not meeting.is_user_belong(user_id):
        return api_error("User has no permission to view this meeting.", 400)

    data = request.get_json()

    is_already_gave = MeetingFeedback.query.filter_by(user_id=user_id, meeting_id=meeting_id).first()
    if is_already_gave:
        return api_error("User already gave feedback.", 400)

    new_feedback = MeetingFeedback(
        meeting_id=meeting_id,
        user_id=user_id,
        comment=data.get('comment'),
        was_successful=True if data.get('was_successful') == "yes" else False,
        stay_together=data.get('stay_together'),
        partner_late=data.get('partner_late'),
    )
    db.session.add(new_feedback)
    db.session.commit()

    return "ok"


@meeting_bp.route('/feedback/<int:meeting_id>', methods=['GET'])
@login_required_api
def get_feedback(meeting_id):
    user_id = get_feedback.cred.user.user_id
    meeting = Meeting.query.get(meeting_id)

    if not meeting.is_user_belong(user_id):
        return api_error("User doesn't have permission to view this meeting.", 400)

    feedbacks = MeetingFeedback.query.filter_by(meeting_id=meeting_id).all()
    feedbacks = [feedback.to_dict() for feedback in feedbacks]

    if not feedbacks:
        feedbacks = []

    return jsonify({
        "user_id": user_id,
        "feedbacks": feedbacks
    })


@meeting_bp.route('/<int:meeting_id>', methods=['POST'])
def update_meeting(meeting_id):
    meeting = Meeting.query.get_or_404(meeting_id)
    data = request.json or {}

    if "meeting_date" in data:
        meeting.meeting_date = data["meeting_date"]
    if "location" in data:
        meeting.location = data["location"]
    if "user1_comment" in data:
        meeting.user1_comment = data["user1_comment"]
    if "user2_comment" in data:
        meeting.user2_comment = data["user2_comment"]
    if "result" in data:
        meeting.result = data["result"]
    if "archived" in data:
        meeting.archived = bool(data["archived"])
    if "user1_id" in data:
        user1 = User.query.get(data["user1_id"])
        if not user1:
            return api_error(f"User with id {data['user1_id']} not found", 404)
        meeting.user1_id = data["user1_id"]
    if "user2_id" in data:
        user2 = User.query.get(data["user2_id"])
        if not user2:
            return api_error(f"User with id {data['user2_id']} not found", 404)
        meeting.user2_id = data["user2_id"]
    if meeting.user1_id == meeting.user2_id:
        return api_error("user1_id and user2_id cannot be the same", 400)

    db.session.commit()
    return jsonify({"message": "Meeting updated", "meeting_id": meeting.meeting_id})
