from flask import request, session, redirect, jsonify

from app import create_app

app = create_app()


free_endpoints = [
    'static',
    'pages.auth'
]
free_api_endpoints = [
    'auth.login',
    'auth.register'
]
@app.before_request
def before_request():
    email = session.get('email')
    if not email:
        if not request.path == "/" and request.endpoint not in free_endpoints:
            return redirect("/auth")

        if not request.endpoint not in free_api_endpoints:
            return jsonify({"status": 'error', 'message': 'Unauthenticated'}), 403

    return

if __name__ == '__main__':
    app.run(debug=True)
