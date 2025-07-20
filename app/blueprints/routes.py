from flask import Blueprint, render_template, redirect, url_for

from app.models import Meeting, Like
from app.utils.access_utils import login_required

pages_bp = Blueprint('pages', __name__)


@pages_bp.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@pages_bp.route('/auth', methods=['GET'])
def auth():
    return render_template('auth.html')


@pages_bp.route('/discover', methods=['GET'])
@login_required
def discover():
    return render_template('discover.html')


@pages_bp.route('/admin', methods=['GET'])
@login_required
def admin():
    return render_template('admin.html')


@pages_bp.route('/profile', methods=['GET'])
@login_required
def profile():
    return render_template('profile.html')


@pages_bp.route('/reactions', methods=['GET'])
@login_required
def user_likes():
    return render_template('reactions.html')


@pages_bp.route('/matches', methods=['GET'])
@login_required
def user_matches():
    return render_template('matches.html')


@pages_bp.route('/meetings', methods=['GET'])
@login_required
def meetings():
    return render_template('meetings.html')


# @pages_bp.route('/meeting/<int:meeting_id>', methods=['GET'])
# @login_required
# def meeting(meeting_id):
#     meeting = Meeting.query.get_or_404(meeting_id)
#     render date-details.html


@pages_bp.route('/user-profile/<int:user_id>', methods=['GET'])
@login_required
def user_profile(user_id):
    creds = user_profile.cred
    user = creds.user

    likes = Like.query.filter_by(from_user_id=user.user_id).all()
    user_ids = [like.to_user_id for like in likes]

    if user_id in user_ids:
        return render_template('user-profile.html', methods=['GET'])

    return redirect("/discover")
