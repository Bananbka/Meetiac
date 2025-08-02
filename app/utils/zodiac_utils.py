import os
from datetime import date

import requests
from dotenv import load_dotenv

from app import db
from app.models import ZodiacSign, ZodiacPrediction
from app.utils.access_utils import api_error

load_dotenv()
API_URL = "https://api.api-ninjas.com/v1/horoscope"
ZODIAC_API_KEY = os.getenv("ZODIAC_API_KEY")
DEEPL_API_KEY = os.getenv("DEEPL_API_KEY")


def get_zodiac_sign(birth_date: date) -> str:
    day = birth_date.day
    month = birth_date.month

    if (month == 1 and day >= 20) or (month == 2 and day <= 18):
        return "aquarius"
    elif (month == 2 and day >= 19) or (month == 3 and day <= 20):
        return "pisces"
    elif (month == 3 and day >= 21) or (month == 4 and day <= 19):
        return "aries"
    elif (month == 4 and day >= 20) or (month == 5 and day <= 20):
        return "taurus"
    elif (month == 5 and day >= 21) or (month == 6 and day <= 20):
        return "gemini"
    elif (month == 6 and day >= 21) or (month == 7 and day <= 22):
        return "cancer"
    elif (month == 7 and day >= 23) or (month == 8 and day <= 22):
        return "leo"
    elif (month == 8 and day >= 23) or (month == 9 and day <= 22):
        return "virgo"
    elif (month == 9 and day >= 23) or (month == 10 and day <= 22):
        return "libra"
    elif (month == 10 and day >= 23) or (month == 11 and day <= 21):
        return "scorpio"
    elif (month == 11 and day >= 22) or (month == 12 and day <= 21):
        return "sagittarius"
    else:
        return "capricorn"


def fetch_today_sign_prediction(sign):
    resp = requests.get(f"{API_URL}?zodiac={sign}", headers={"X-Api-Key": f"{ZODIAC_API_KEY}"})
    data = resp.json()

    prediction_en = data.get("horoscope")

    if not prediction_en:
        raise Exception("No horoscope found")

    return prediction_en


def translate_prediction(prediction):
    resp = requests.post(
        "https://api-free.deepl.com/v2/translate",
        headers={"Authorization": f"DeepL-Auth-Key {DEEPL_API_KEY}"},
        data={
            "text": prediction,
            "target_lang": "UK",
        },
    )
    data = resp.json()
    translation = data.get("translations")
    if not isinstance(translation, list) and len(translation) > 0:
        raise Exception("Error while getting translation of prediction.", 400)

    trans_data = translation[0].get("text")
    return trans_data


def create_sign_prediction(zodiac: ZodiacSign):
    today = date.today()
    prediction_en = fetch_today_sign_prediction(zodiac.name)
    prediction_ua = translate_prediction(prediction_en)

    new_prediction = ZodiacPrediction(
        sign_id=zodiac.sign_id,
        prediction=prediction_en,
        prediction_ua=prediction_ua
    )
    db.session.add(new_prediction)
    db.session.commit()

    return {
        "sign": zodiac.name,
        "prediction": prediction_en,
        "prediction_ua": prediction_ua,
        "date": today.strftime("%d.%m.%Y")
    }


def update_sign_prediction(zodiac: ZodiacSign):
    today = date.today()
    past_pred = ZodiacPrediction.query.filter(ZodiacPrediction.sign_id == zodiac.sign_id).first()

    prediction_en = fetch_today_sign_prediction(zodiac.name)
    prediction_ua = translate_prediction(prediction_en)

    past_pred.prediction = prediction_en
    past_pred.prediction_ua = prediction_ua
    past_pred.prediction_date = today
    db.session.add(past_pred)
    db.session.commit()
    return {
        "sign": zodiac.name,
        "prediction": prediction_en,
        "prediction_ua": prediction_ua,
        "date": today.strftime("%d.%m.%Y")
    }


def get_sign_prediction(zodiac: ZodiacSign):
    today = date.today()
    past_pred = ZodiacPrediction.query.filter(ZodiacPrediction.sign_id == zodiac.sign_id).first()

    return {
        "sign": zodiac.name,
        "prediction": past_pred.prediction,
        "prediction_ua": past_pred.prediction_ua,
        "date": today.strftime("%d.%m.%Y")
    }