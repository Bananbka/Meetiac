from app.database import db


class ZodiacSign(db.Model):
    __tablename__ = 'zodiac_sign'
    sign_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    users = db.relationship('User', back_populates='zodiac_sign')
