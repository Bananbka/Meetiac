from app.database import db


class PreferenceSign(db.Model):
    __tablename__ = 'preference_signs'

    id = db.Column(db.Integer, primary_key=True)
    preference_id = db.Column(db.Integer, db.ForeignKey('partner_preferences.preference_id'), nullable=False)
    sign_id = db.Column(db.Integer, db.ForeignKey('zodiac_sign.sign_id'), nullable=False)