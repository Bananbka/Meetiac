from app.database import db


class Interest(db.Model):
    __tablename__ = 'interest'

    interest_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    users = db.relationship('User', secondary='user_interest', back_populates='interests')
