from flask import Blueprint, render_template

pages_bp = Blueprint('pages', __name__)


@pages_bp.route('/')
def index():
    return render_template('index.html')


@pages_bp.route('/auth')
def auth():
    return render_template('auth.html')


@pages_bp.route('/discover')
def discover():
    return render_template('discover.html')


@pages_bp.route('/admin')
def admin():
    return render_template('admin.html')


@pages_bp.route('/profile')
def profile():
    return render_template('profile.html')
