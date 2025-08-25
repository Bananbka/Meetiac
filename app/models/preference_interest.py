from app.database import db


class PreferenceInterest(db.Model):
    __tablename__ = 'preference_interest'

    preference_interest_id = db.Column(db.Integer, primary_key=True)
    preference_id = db.Column(db.Integer, db.ForeignKey('partner_preferences.preference_id', ondelete='CASCADE'))
    interest_id = db.Column(db.Integer, db.ForeignKey('interest.interest_id'))