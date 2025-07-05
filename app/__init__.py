from flask import Flask

from app.database import db
from app.config import Config


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)

    from app.models.user import User
    from app.models.partner_preference import PartnerPreference
    from app.models.meeting import Meeting
    from app.models.couple import Couple
    from app.models.refusal import Refusal
    from app.models.credentials import Credentials
    with app.app_context():
        db.create_all()

    return app
