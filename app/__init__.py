from flask import Flask
from flask_migrate import Migrate

from app.database import db
from app.config import Config

migrate = Migrate()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Ініціалізація бази даних
    db.init_app(app)
    migrate.init_app(app, db)

    from app import models

    from app.blueprints.routes import pages_bp
    from app.blueprints.api.auth import auth_bp
    from app.blueprints.api.profile import profile_bp
    from app.blueprints.api.zodiac import zodiac_bp
    from app.blueprints.api.discover import discover_bp

    app.register_blueprint(pages_bp)
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(profile_bp, url_prefix='/api/profile')
    app.register_blueprint(zodiac_bp, url_prefix='/api/zodiac')
    app.register_blueprint(discover_bp, url_prefix='/api/discover')

    return app
