from datetime import datetime, UTC

from flask import Blueprint, request
from flask_mail import Message

from app import db
from app.mail import mail
from app.models import RestoreCode, Credentials
from app.utils.access_utils import api_error
from app.utils.restore_utils import generate_numeric_code, generate_token

restore_bp = Blueprint('restore', __name__)

PASSWORD_CHANGED_MESSAGE = """
<html>
  <body style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px; color: #333;">
    <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
      <h2 style="color: #4a90e2; text-align: center;">Пароль змінено</h2>
      <p>Вітаємо!</p>
      <p>Пароль до вашого облікового запису <b>Meetiac</b> було успішно змінено.</p>
      <p>Дата та час зміни: <b>{0}</b></p>
      <p>Якщо ви не виконували цю дію, негайно зверніться до нашої служби підтримки, щоб захистити свій обліковий запис.</p>
      <hr style="margin: 20px 0;">
      <p style="font-size: 12px; color: #aaa; text-align: center;">
        © 2025 Meetiac. Усі права захищено.
      </p>
    </div>
  </body>
</html>
"""

RESTORE_MESSAGE = """
<html>
  <body style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px; color: #333;">
    <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
      <h2 style="color: #4a90e2; text-align: center;">Відновлення доступу</h2>
      <p>Вітаємо!</p>
      <p>Ви запросили відновлення доступу до свого облікового запису <b>Meetiac</b>.</p>
      <p>Ваш код відновлення:</p>
      <div style="text-align: center; font-size: 24px; font-weight: bold; color: #4a90e2; margin: 20px 0;">
        {0}
      </div>
      <p>Введіть цей код у формі відновлення пароля. Код дійсний протягом <b>15 хвилин</b>.</p>
      <p style="font-size: 14px; color: #777;">
        Якщо ви не надсилали запит на відновлення, просто проігноруйте це повідомлення.
      </p>
      <hr style="margin: 20px 0;">
      <p style="font-size: 12px; color: #aaa; text-align: center;">
        © 2025 Meetiac. Усі права захищено.
      </p>
    </div>
  </body>
</html>
"""


@restore_bp.route('/get-code', methods=['GET'])
def get_restore_code():
    email = request.form.get('email')
    email = "nikitaz9251015@gmail.com"

    creds = Credentials.query.filter_by(login=email).first()

    if not creds:
        return api_error("There is no user with this email.", 404)

    RestoreCode.query.filter_by(creds_id=creds.key_id).delete()

    recovery_code = generate_numeric_code(6)
    token = generate_token()

    new_restore = RestoreCode(creds_id=creds.key_id, code=recovery_code, token=token)
    db.session.add(new_restore)
    db.session.commit()

    msg = Message("Ваш код відновлення до Meetiac", recipients=[email])
    msg.html = RESTORE_MESSAGE.format(recovery_code)

    mail.send(msg)
    return {"status": "ok"}


@restore_bp.route('/restore-account', methods=['POST'])
def restore_account():
    email = request.form.get('email')
    code = request.form.get('code')

    creds = Credentials.query.filter_by(login=email).first()
    if not creds:
        return api_error("There is no user with this email.", 404)

    restore_code = RestoreCode.query.filter_by(creds_id=creds.key_id, code=code).first()
    if not restore_code:
        return api_error("Invalid restore code.", 400)

    if restore_code.expire_at < datetime.now(UTC):
        return api_error("Restore code expired.", 401)

    return {
        "status": "ok",
        "token": restore_code.token
    }


@restore_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('password')

    restore_code = RestoreCode.query.filter_by(token=token).first()
    if not restore_code:
        return api_error("Invalid restore token.", 400)

    if restore_code.expire_at < datetime.now(UTC):
        return api_error("Restore token has expired.", 400)

    creds = restore_code.creds
    creds.set_password(new_password)
    db.session.add(creds)
    db.session.delete(restore_code)
    db.session.commit()

    msg = Message("Пароль змінено", recipients=[creds.login])
    msg.html = PASSWORD_CHANGED_MESSAGE.format(datetime.now(UTC).strftime("%d.%m.%Y %H:%M UTC"))
    mail.send(msg)

    return {"status": "ok"}
