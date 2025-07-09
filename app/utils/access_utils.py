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
        if 'email' not in session:
            return redirect('/auth')
        return f(*args, **kwargs)

    return decorated_function
