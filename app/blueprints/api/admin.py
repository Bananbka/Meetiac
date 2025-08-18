from flask import Blueprint

from app.utils.access_utils import login_required_api, admin_access_required_api
from app.utils.admin_utils import get_conducted_meetings_by_gender, get_user_stats, get_match_stats, get_zodiac_stats, \
    get_registrations_last_week

admin_bp = Blueprint('admin', __name__)

@admin_bp.route("/")
@login_required_api
@admin_access_required_api
def __index():
    a = get_conducted_meetings_by_gender()
    print(a)
    return "heh"


@admin_bp.route("/get-user-stats", methods=["GET"])
@login_required_api
@admin_access_required_api
def user_stats():
    return get_user_stats()


@admin_bp.route("/get-match-stats", methods=["GET"])
@login_required_api
@admin_access_required_api
def match_stats():
    return get_match_stats()


@admin_bp.route("/get-zodiac-stats", methods=["GET"])
@login_required_api
@admin_access_required_api
def zodiac_stats():
    return get_zodiac_stats()


@admin_bp.route("/get-registration-stats", methods=["GET"])
@login_required_api
@admin_access_required_api
def registration_stats():
    return get_registrations_last_week()