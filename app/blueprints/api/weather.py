import os

import requests
from dotenv import load_dotenv
from flask import Blueprint, request

from app.utils.access_utils import api_error, login_required_api

load_dotenv()

weather_bp = Blueprint('weather', __name__)

WEATHER_LINK = "https://api.openweathermap.org/data/2.5/weather"
API_KEY = os.getenv("WEATHER_API_KEY")


@weather_bp.route("/", methods=['GET'])
@login_required_api
def get_weather():
    lat = request.args.get("lat")
    lon = request.args.get("lon")

    if not lat and not lon:
        return api_error("Missing required parameters (lat, lon).", 400)

    link = f"{WEATHER_LINK}?lat={lat}&lon={lon}&lang=ua&units=metric&appid={API_KEY}"
    resp = requests.get(link)

    if resp.status_code != 200:
        return api_error("Error while getting weather", resp.status_code)

    return resp.json()
