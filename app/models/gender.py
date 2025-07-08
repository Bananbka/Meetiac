from app.database import db


class Gender(db.Model):
    __tablename__ = 'gender'

    gender_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)