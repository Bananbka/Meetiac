from flask import Blueprint, render_template

pages_bp = Blueprint('pages', __name__)


@pages_bp.route('/', methods=['GET'])
def index():
    return render_template('index.html', methods=['GET'])


@pages_bp.route('/auth')
def auth():
    return render_template('auth.html', methods=['GET'])


@pages_bp.route('/discover')
def discover():
    return render_template('discover.html', methods=['GET'])


@pages_bp.route('/admin')
def admin():
    return render_template('admin.html', methods=['GET'])


@pages_bp.route('/profile')
def profile():
    return render_template('profile.html', methods=['GET'])
