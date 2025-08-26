import logging
import os
from logging.handlers import RotatingFileHandler
from flask import Flask, request
from flask_migrate import Migrate

from app.blueprints.api.admin import admin_bp
from app.blueprints.api.controllers.credentials_controller import creds_bp
from app.blueprints.api.reactions import reaction_bp
from app.database import db
from app.config import Config
from app.mail import mail

migrate = Migrate()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Ініціалізація бази даних
    db.init_app(app)
    migrate.init_app(app, db)
    from app import models

    # Ініціалізація пошти
    mail.init_app(app)

    # Імпорт блупрінтів
    from app.blueprints.routes import pages_bp
    from app.blueprints.api.auth import auth_bp
    from app.blueprints.api.profile import profile_bp
    from app.blueprints.api.zodiac import zodiac_bp
    from app.blueprints.api.discover import discover_bp
    from app.blueprints.api.restore_password import restore_bp

    from app.blueprints.api.controllers.user_controller import user_bp
    from app.blueprints.api.controllers.match_controller import match_bp
    from app.blueprints.api.controllers.meeting_controller import meeting_bp

    from app.blueprints.api.weather import weather_bp

    app.register_blueprint(pages_bp)
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(profile_bp, url_prefix='/api/profile')
    app.register_blueprint(zodiac_bp, url_prefix='/api/zodiac')
    app.register_blueprint(discover_bp, url_prefix='/api/discover')
    app.register_blueprint(reaction_bp, url_prefix='/api/reactions')
    app.register_blueprint(restore_bp, url_prefix='/api/restore')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    app.register_blueprint(user_bp, url_prefix='/api/user')
    app.register_blueprint(match_bp, url_prefix='/api/match')
    app.register_blueprint(meeting_bp, url_prefix='/api/meeting')
    app.register_blueprint(creds_bp, url_prefix='/api/credentials')

    app.register_blueprint(weather_bp, url_prefix='/api/weather')

    # Логування
    if not os.path.exists("logs"):
        os.mkdir("logs")

    file_handler = RotatingFileHandler("logs/app.log", maxBytes=10240, backupCount=5, delay=True)
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(logging.Formatter(
        "%(asctime)s [%(levelname)s] %(message)s"
    ))

    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)

    # Мідлвейри для логів
    @app.before_request
    def log_request():
        app.logger.info(
            f"Request: {request.method} {request.path} "
            f"from {request.remote_addr}"
        )

    @app.after_request
    def log_response(response):
        app.logger.info(
            f"Answer: {response.status} "
            f"on {request.method} {request.path}"
        )
        return response

    return app
