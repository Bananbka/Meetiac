from flask import Blueprint, request

from app.utils.access_utils import login_required_api, api_error

zodiac_bp = Blueprint('zodiac', __name__)


@zodiac_bp.route('/compatibility', methods=['GET'])
@login_required_api
def get_compatibility():
    data = request.args
    first_sign = data.get('first_sign')
    second_sign = data.get('second_sign')

    if not all([first_sign, second_sign]):
        return api_error("Missing sign.", 400)

    return 'giga'


@zodiac_bp.route('/prediction', methods=['GET'])
def get_prediction():
    pass