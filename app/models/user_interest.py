from app.database import db


class UserInterest(db.Model):
    __tablename__ = 'user_interest'

    user_interest_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    interest_id = db.Column(db.Integer, db.ForeignKey('interest.interest_id'), nullable=False)
