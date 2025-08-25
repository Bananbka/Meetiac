from flask import Blueprint, request, jsonify

from app.database import db
from app.models import Credentials
from app.utils.access_utils import api_error, login_required_api, admin_access_required_api
from app.utils.admin_utils import paginate_query, is_valid_email

creds_bp = Blueprint('credentials', __name__)


@creds_bp.route('/<int:creds_id>', methods=['POST'])
@login_required_api
@admin_access_required_api
def update_creds(creds_id):
    creds: Credentials = Credentials.query.get_or_404(creds_id)
    data = request.json or {}

    if "login" in data:
        login = data["login"]
        if login.strip() == '':
            return api_error("Empty login", 400)

        if not is_valid_email(login):
            return api_error("Not valid email", 400)

        creds.login = login
    if "password" in data:
        password = data["password"]
        if password.strip() == '':
            return api_error("Empty password", 400)
        creds.set_password(data["password"])
    if "access_right" in data:
        creds.access_right = data["access_right"]

    db.session.commit()
    return jsonify({"message": "Credentials updated", "key_id": creds.key_id})


@creds_bp.route('/', methods=['GET'])
@login_required_api
@admin_access_required_api
def get_credentials():
    return paginate_query(Credentials.query, lambda c: c.to_dict())


@creds_bp.route('/<int:creds_id>', methods=['DELETE'])
@login_required_api
@admin_access_required_api
def delete_credentials(creds_id):
    creds = Credentials.query.get_or_404(creds_id)
    db.session.delete(creds)
    db.session.commit()
    return jsonify({"message": "Credentials deleted"})
