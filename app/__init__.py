from flask import Flask
from flask_migrate import Migrate

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

    app.register_blueprint(user_bp, url_prefix='/api/user')
    app.register_blueprint(match_bp, url_prefix='/api/match')
    app.register_blueprint(meeting_bp, url_prefix='/api/meeting')

    app.register_blueprint(weather_bp, url_prefix='/api/weather')

    return app
