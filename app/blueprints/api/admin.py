from flask import Blueprint

from app.utils.access_utils import login_required_api, admin_access_required_api
from app.utils.admin_utils import get_conducted_meetings_by_gender, get_user_stats, get_match_stats, get_zodiac_stats, \
    get_registrations_last_week, get_quarterly_clients, get_successful_couples_info, get_planned_meetings, \
    get_recent_registrations, get_attendance_by_gender, get_refusal_count, get_successful_couples

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


# Потрібні для виконання умов курсової
@admin_bp.route("/get-quarterly-clients", methods=["GET"])
@login_required_api
@admin_access_required_api
def quarterly_clients():
    return get_quarterly_clients()


@admin_bp.route("/get-successful-couples-info", methods=["GET"])
@login_required_api
@admin_access_required_api
def successful_couples_info():
    return get_successful_couples_info()


@admin_bp.route("/get-planned-meetings", methods=["GET"])
@login_required_api
@admin_access_required_api
def planned_meetings():
    return get_planned_meetings()


@admin_bp.route("/get-recent-registrations", methods=["GET"])
@login_required_api
@admin_access_required_api
def recent_registrations():
    return get_recent_registrations()


@admin_bp.route("/get-attendance-by-gender", methods=["GET"])
@login_required_api
@admin_access_required_api
def attendance_by_gender():
    return get_attendance_by_gender()


@admin_bp.route("/get-refusal-count", methods=["GET"])
@login_required_api
@admin_access_required_api
def refusal_count():
    return get_refusal_count()


@admin_bp.route("/get-successful-couples", methods=["GET"])
@login_required_api
@admin_access_required_api
def successful_couples():
    return get_successful_couples()


@admin_bp.route("/get-conducted-meetings-by-gender", methods=["GET"])
@login_required_api
@admin_access_required_api
def conducted_meetings_by_gender():
    return get_conducted_meetings_by_gender()