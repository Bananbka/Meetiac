from functools import wraps

from flask import jsonify, session, redirect


def login_required_api(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'email' not in session:
            return jsonify({'error': 'Not logged in'}), 401
        return f(*args, **kwargs)

    return decorated_function


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'email' not in session:
            return redirect('/auth')
        return f(*args, **kwargs)

    return decorated_function
