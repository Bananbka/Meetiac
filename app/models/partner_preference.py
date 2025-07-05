from app.database import db


class PartnerPreference(db.Model):
    __tablename__ = 'partner_preferences'
    preference_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    min_age = db.Column(db.Integer)
    max_age = db.Column(db.Integer)
    min_height = db.Column(db.Integer)
    max_height = db.Column(db.Integer)
    min_weight = db.Column(db.Integer)
    max_weight = db.Column(db.Integer)
    zodiac_signs = db.Column(db.Text)  # можна зберігати через коми або JSON
