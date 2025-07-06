from flask import request, jsonify, Blueprint, session
from datetime import datetime

from app.database import db
from app.models.credentials import Credentials
from app.models.refusal import Refusal
from app.models.user import User
from app.utils.zodiac_utils import get_zodiac_sign

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    print(data)

    if Credentials.query.filter_by(login=data["register-email"]).first():
        return jsonify({"status": "error", "message": "User already exists"}), 409
    # a = {'first-name': '1', 'last-name': '1',
    #      'register-email': '1@1.1', 'birthdate': '2025-07-08',
    #      'zodiac': 'aquarius', 'register-password': 'qwe', 'confirm-password': 'qwe'}

    birthdate = datetime.strptime(data['birthdate'], '%Y-%m-%d')
    zodiac = get_zodiac_sign(birthdate)
    new_user = User(
        first_name=data["first-name"],
        last_name=data["last-name"],
        birth_date=data["birthdate"],
        zodiac_sign=zodiac,
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
    print(data)

    creds = Credentials.query.filter_by(login=data["login-email"]).first()
    if not creds:
        return jsonify({"status": "error", "message": "User does not exist"}), 409

    if not creds.check_password(data["login-password"]):
        return jsonify({"status": "error", "message": "Wrong password"}), 409

    session['email'] = data["login-email"]

    return jsonify({"status": "success", "message": "User has been logged in"})


@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.pop('email', None)
    return jsonify({"status": "success"})


@auth_bp.route('/disable-account', methods=['POST'])
def delete_account():
    data = request.get_json()
    print(data)

    email = session.get('email')
    if not email:
        return jsonify({"status": "error", "message": "User isn't logged in."}), 400

    creds = Credentials.query.filter_by(login=email).first()
    if not creds:
        return jsonify({"status": "error", "message": "User doesn't exist"}), 409

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
