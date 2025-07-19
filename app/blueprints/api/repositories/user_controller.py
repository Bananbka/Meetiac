from flask import Blueprint, request

from app.models import User
from app.utils.access_utils import api_error

user_bp = Blueprint('user', __name__)


@user_bp.route('/<int:user_id>', methods=['GET'])
def user(user_id):
    is_detailed = request.args.get('is_detailed')

    fields = []
    if is_detailed == "True":
        fields = ["age", "gender", "birth_date", "height", "weight", "sign", "bio", "images", "interests"]

    user_object = User.query.filter_by(user_id=user_id).first()
    return user_object.to_dict(fields) if user_object else api_error("User not found", 404)
