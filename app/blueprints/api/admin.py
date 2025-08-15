from flask import Blueprint

from app.utils.admin_utils import get_conducted_meetings_by_gender

admin_bp = Blueprint('admin', __name__)

@admin_bp.route("/")
def __index():
    a = get_conducted_meetings_by_gender()
    print(a)
    return "heh"