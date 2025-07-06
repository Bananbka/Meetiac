from datetime import date

from app.database import db


class Couple(db.Model):
    __tablename__ = 'couples'
    couple_id = db.Column(db.Integer, primary_key=True)
    user1_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    user2_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    created_at = db.Column(db.Date, default=date.today)
    archived = db.Column(db.Boolean, default=False)
    comment = db.Column(db.Text)