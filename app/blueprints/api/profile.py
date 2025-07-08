import os
import base64
from datetime import datetime

from flask import Blueprint, request, jsonify, session

from app.database import db
from app.models import Credentials, UserImage, UserInterest, Interest, PartnerPreference, ZodiacSign, Gender, \
    PreferenceSign
from app.utils.access_utils import login_required_api
from app.utils.zodiac_utils import get_zodiac_sign

profile_bp = Blueprint('profile', __name__, url_prefix='/profile')
UPLOAD_FOLDER = 'app/static/uploads'


@profile_bp.route('/update-profile', methods=['POST'])
@login_required_api
def update_profile():
    user_email = session.get('email')
    cred = Credentials.query.filter_by(login=user_email).first()
    if not cred:
        return jsonify({"status": 'error', 'message': 'User don\'t exists'}), 404

    user = cred.user

    data = request.get_json()
    photos = data.get("photos", [])

    old_images = UserImage.query.filter_by(user_id=user.user_id).all()
    delete_old_images(old_images)

    for idx, photo_data_uri in enumerate(photos):
        os.makedirs("uploads", exist_ok=True)

        ext = get_extension_from_data_uri(photo_data_uri)
        filename = f"user_{user.user_id}_{idx}.{ext}"
        save_path = f"{UPLOAD_FOLDER}/{filename}"
        save_base64_image(photo_data_uri, save_path)

        new_image = UserImage(
            user_id=user.user_id,
            image_path=save_path,
        )
        db.session.add(new_image)

    raw_gender = data.get('gender')
    gender = Gender.query.filter_by(name=raw_gender).first()
    user.gender = gender.gender_id

    birthdate = datetime.strptime(data['birthdate'], '%Y-%m-%d')
    zodiac_name = get_zodiac_sign(birthdate)
    zodiac = ZodiacSign.query.filter_by(name=zodiac_name).first()

    user.first_name = data.get('name')
    user.last_name = data.get('surname')
    user.birth_date = data.get('birthdate')
    user.height = data.get('height')
    user.weight = data.get('weight')
    user.bio = data.get('bio')
    user.sign_id = zodiac.sign_id

    interests = data.get("interests", [])
    UserInterest.query.filter_by(user_id=user.user_id).delete()
    for interest in interests:
        interest = Interest.query.filter_by(name=interest).first()
        new_interest = UserInterest(
            user_id=user.user_id,
            interest_id=interest.interest_id,
        )
        db.session.add(new_interest)

    db.session.commit()
    return jsonify({
        "message": "Профіль оновлено і фото збережено",
    })


def save_base64_image(data_uri, save_path):
    header, encoded = data_uri.split(",", 1)
    data = base64.b64decode(encoded)
    with open(save_path, "wb") as f:
        f.write(data)


def get_extension_from_data_uri(data_uri):
    mime_part = data_uri.split(";")[0]
    ext = mime_part.split("/")[1]
    return ext


def delete_old_images(images: list[UserImage]):
    for img in images:
        try:
            os.remove(img.image_path)
        except FileNotFoundError:
            pass
        db.session.delete(img)


@profile_bp.route('/update-preferences', methods=['POST'])
@login_required_api
def update_preferences():
    user_email = session.get('email')
    cred = Credentials.query.filter_by(login=user_email).first()
    if not cred:
        return jsonify({"status": 'error', 'message': 'User don\'t exists'}), 404

    user = cred.user

    data = request.get_json()

    gender = data.get('looking_for', "any")
    gender_object = Gender.query.filter_by(name=gender).first()
    if not gender_object:
        return jsonify({"status": 'error', 'message': 'Gender don\'t exists'}), 404

    old_partner_preference = PartnerPreference.query.filter_by(user_id=user.user_id).first()
    if old_partner_preference:
        PreferenceSign.query.filter_by(preference_id=old_partner_preference.preference_id).delete()
        db.session.delete(old_partner_preference)

    new_preference = PartnerPreference(
        user_id=user.user_id,
        min_age=data.get('min_age'),
        max_age=data.get('max_age'),
        min_height=data.get('min_height'),
        max_height=data.get('max_height'),
        min_weight=data.get('min_weight'),
        max_weight=data.get('max_weight'),
        gender_id=gender_object.gender_id,
    )
    db.session.add(new_preference)
    db.session.flush()

    zodiacs = data.get("zodiac_signs", [])
    signs = ZodiacSign.query.filter(ZodiacSign.name.in_(zodiacs)).all()
    new_preference_signs = [
        PreferenceSign(preference_id=new_preference.preference_id, sign_id=sign.sign_id)
        for sign in signs
    ]
    db.session.add_all(new_preference_signs)

    db.session.commit()
    return jsonify({"status": 'ok'})
