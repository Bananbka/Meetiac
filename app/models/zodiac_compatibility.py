from app.database import db

class ZodiacCompatibility(db.Model):
    __tablename__ = 'zodiac_compatibility'

    id = db.Column(db.Integer, primary_key=True)
    sign1_id = db.Column(db.Integer, db.ForeignKey('zodiac_sign.sign_id'))
    sign2_id = db.Column(db.Integer, db.ForeignKey('zodiac_sign.sign_id'))
    percent = db.Column(db.Integer)
    description = db.Column(db.Text)

    sign1 = db.relationship('ZodiacSign', foreign_keys=[sign1_id])
    sign2 = db.relationship('ZodiacSign', foreign_keys=[sign2_id])