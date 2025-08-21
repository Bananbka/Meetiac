from flask import Blueprint, request, jsonify

from app.database import db
from app.models import User
from app.utils.access_utils import api_error, login_required_api, admin_access_required_api
from app.utils.admin_utils import paginate_query

user_bp = Blueprint('user', __name__)


@user_bp.route('/<int:user_id>', methods=['GET'])
@login_required_api
def user(user_id):
    is_detailed = request.args.get('is_detailed')

    fields = []
    if is_detailed == "True":
        fields = ["age", "gender", "birth_date", "height", "weight", "sign", "bio", "images", "interests"]

    user_object = User.query.filter_by(user_id=user_id).first()
    return user_object.to_dict(fields) if user_object else api_error("User not found", 404)


@user_bp.route('/<int:user_id>', methods=['POST'])
@login_required_api
@admin_access_required_api
def update_user(user_id):
    user_data = User.query.get_or_404(user_id)
    data = request.json or {}

    if "first_name" in data:
        user_data.first_name = data["first_name"]
    if "last_name" in data:
        user_data.last_name = data["last_name"]
    if "bio" in data:
        user_data.bio = data["bio"]
    if "is_active" in data:
        user_data.is_active = bool(data["is_active"])

    if "is_admin" in data:
        user.is_admin = bool(data["is_admin"])

        if user.credentials:
            if user.is_admin:
                user.credentials.access_right = "operator"
            else:
                user.credentials.access_right = "authorized"

    db.session.commit()
    return jsonify({"message": "User updated", "user_id": user_data.user_id})


@user_bp.route('/', methods=['GET'])
@login_required_api
@admin_access_required_api
def get_users():
    return paginate_query(User.query, lambda u: u.to_dict(full=True))
