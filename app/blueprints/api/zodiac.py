import os
from datetime import date

import requests
from flask import Blueprint, request
from dotenv import load_dotenv

from app import db
from app.models import ZodiacSign, ZodiacPrediction
from app.models.zodiac_compatibility import ZodiacCompatibility
from app.utils.access_utils import login_required_api, api_error
from app.utils.zodiac_utils import get_sign_prediction, translate_prediction, create_sign_prediction, \
    update_sign_prediction

zodiac_bp = Blueprint('zodiac', __name__)

load_dotenv()
API_URL = "https://api.api-ninjas.com/v1/horoscope"
API_KEY = os.getenv("ZODIAC_API_KEY")


@zodiac_bp.route('/compatibility', methods=['GET'])
@login_required_api
def get_compatibility():
    data = request.args
    first_sign = data.get('first_sign')
    second_sign = data.get('second_sign')

    if not first_sign:
        return api_error("Missing sign.", 400)


    zodiac1 = ZodiacSign.query.filter(ZodiacSign.name == first_sign).first()
    if not second_sign:
        zodiac2 = get_compatibility.cred.user.zodiac_sign
    else:
        zodiac2 = ZodiacSign.query.filter(ZodiacSign.name == second_sign).first()

    if not all([zodiac1, zodiac2]):
        return api_error("Unknown sign name.", 400)

    zodiac_data = ZodiacCompatibility.query.filter(
        ((ZodiacCompatibility.sign1_id == zodiac1.sign_id) & (ZodiacCompatibility.sign2_id == zodiac2.sign_id)) |
        ((ZodiacCompatibility.sign1_id == zodiac2.sign_id) & (ZodiacCompatibility.sign2_id == zodiac1.sign_id))
    ).first()

    return {
        "sign1": zodiac1.name,
        "sign2": zodiac2.name,
        "percent": zodiac_data.percent,
        "description": zodiac_data.description,
    }


@zodiac_bp.route('/prediction', methods=['GET'])
@login_required_api
def get_prediction():
    zodiac_name = request.args.get('sign')

    if not zodiac_name:
        zodiac = get_prediction.cred.user.zodiac_sign
    else:
        zodiac = ZodiacSign.query.filter(ZodiacSign.name == zodiac_name).first()

    if not zodiac:
        return api_error("Unknown sign.", 400)

    prediction = ZodiacPrediction.query.filter(ZodiacPrediction.sign_id == zodiac.sign_id).first()

    if not prediction:
        return create_sign_prediction(zodiac)

    today = date.today()
    if today > prediction.prediction_date:
        return update_sign_prediction(zodiac)

    return get_sign_prediction(zodiac)
