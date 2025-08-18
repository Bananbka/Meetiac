from functools import wraps

from flask import jsonify, session, redirect

from app.models import Credentials


def login_required_api(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_email = session.get('email')
        if not user_email:
            return jsonify({'error': 'Not logged in'}), 401

        cred = Credentials.query.filter_by(login=user_email).first()
        if not cred:
            return jsonify({"status": 'error', 'message': 'User don\'t exists'}), 404

        decorated_function.cred = cred
        return f(*args, **kwargs)

    return decorated_function


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_email = session.get('email')
        if not user_email:
            return redirect('/auth')

        cred = Credentials.query.filter_by(login=user_email).first()
        if not cred:
            return redirect('/auth')

        decorated_function.cred = cred
        return f(*args, **kwargs)

    return decorated_function


def admin_access_required_api(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_email = session.get('email')
        cred = Credentials.query.filter_by(login=user_email).first()
        user = cred.user
        if not user.is_admin:
            return api_error("Access denied", 401)
        return f(*args, **kwargs)

    return decorated_function

def admin_access_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_email = session.get('email')
        cred = Credentials.query.filter_by(login=user_email).first()
        user = cred.user
        if not user.is_admin:
            return redirect('/discover')
        return f(*args, **kwargs)

    return decorated_function



def api_error(message: str, code: int):
    return jsonify({'status': 'error', 'message': message}), code
