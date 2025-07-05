from datetime import date

from app.database import db


class Refusal(db.Model):
    __tablename__ = 'refusals'
    refusal_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    refusal_date = db.Column(db.Date, default=date.today)
    reason = db.Column(db.Text)