from datetime import date

from app.database import db

class ZodiacPrediction(db.Model):
    __tablename__ = 'zodiac_prediction'

    id = db.Column(db.Integer, primary_key=True)
    sign_id = db.Column(db.Integer, db.ForeignKey('zodiac_sign.sign_id'), unique=True)
    prediction = db.Column(db.Text)
    prediction_ua = db.Column(db.Text)
    prediction_date = db.Column(db.Date, default=date.today)

    sign = db.relationship('ZodiacSign', backref='predicted_zodiac_sign')