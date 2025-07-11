from flask import request, jsonify, Blueprint, session
from datetime import datetime

from app.database import db
from app.models import ZodiacSign, Gender
from app.models.credentials import Credentials
from app.models.refusal import Refusal
from app.models.user import User
from app.utils.access_utils import login_required_api, api_error
from app.utils.zodiac_utils import get_zodiac_sign

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if Credentials.query.filter_by(login=data["register-email"]).first():
        return api_error("User already exists.", 409)

    birthdate = datetime.strptime(data['birthdate'], '%Y-%m-%d')
    zodiac_name = get_zodiac_sign(birthdate)
    zodiac = ZodiacSign.query.filter_by(name=zodiac_name).first()

    raw_gender = data['gender']
    gender = Gender.query.filter_by(name=raw_gender).first()

    new_user = User(
        first_name=data["first-name"],
        last_name=data["last-name"],
        birth_date=data["birthdate"],
        sign_id=zodiac.sign_id,
        gender=gender.gender_id
    )
    db.session.add(new_user)
    db.session.flush()

    new_creds = Credentials(
        login=data["register-email"],
        access_right="authorized",
        user_id=new_user.user_id
    )
    new_creds.set_password(data["register-password"])
    db.session.add(new_creds)

    db.session.commit()

    session['email'] = data["register-email"]

    return jsonify({"status": "success", "message": "User has been created"})


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    creds = Credentials.query.filter_by(login=data["login-email"]).first()
    if not creds:
        return api_error("User does not exist.", 409)

    if not creds.check_password(data["login-password"]):
        return api_error("Wrong password.", 409)

    session['email'] = data["login-email"]

    return jsonify({"status": "success", "message": "User has been logged in"})


@auth_bp.route('/logout', methods=['POST'])
@login_required_api
def logout():
    session.pop('email', None)
    return jsonify({"status": "success"})


@auth_bp.route('/disable-account', methods=['POST'])
@login_required_api
def delete_account():
    data = request.get_json()

    creds = delete_account.cred
    user = creds.user

    refuse_time = datetime.strptime(data['timestamp'], "%Y-%m-%dT%H:%M:%S.%fZ")
    new_refusal = Refusal(
        user_id=user.user_id,
        refusal_date=refuse_time,
        reason=data["reason"],
        other_reason=data["other-reason"],
        additional_info=data["additional-comments"]
    )
    db.session.add(new_refusal)
    db.session.flush()

    user.is_active = False
    db.session.delete(creds)
    db.session.commit()

    del session['email']
    return jsonify({"status": 'success', 'message': 'User has been disabled'})
