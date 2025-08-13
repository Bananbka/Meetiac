from flask import Blueprint, request
from flask_mail import Message

from app.mail import mail

restore_bp = Blueprint('restore', __name__)


@restore_bp.route('/get-code', methods=['GET'])
def get_restore_code():
    email = request.form.get('email')
    email = "nikitaz9251015@gmail.com"

    msg = Message("Ваш код відновлення до Meetiac", recipients=[email])
    msg.body = "хех)"
    mail.send(msg)
    return "heh"
