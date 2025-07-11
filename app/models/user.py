from datetime import date

from app.database import db


class User(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True)
    gender = db.Column(db.Integer, db.ForeignKey('gender.gender_id'))
    registration_date = db.Column(db.Date, default=date.today)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    birth_date = db.Column(db.Date)
    height = db.Column(db.Integer)
    weight = db.Column(db.Integer)
    sign_id = db.Column(db.Integer, db.ForeignKey('zodiac_sign.sign_id'))
    bio = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)

    credentials = db.relationship('Credentials', backref='user', cascade="all, delete-orphan", uselist=False)
    preferences = db.relationship('PartnerPreference', backref='user', cascade="all, delete-orphan")
    meetings1 = db.relationship('Meeting', foreign_keys='Meeting.user1_id', backref='user1',
                                cascade="all, delete-orphan")
    meetings2 = db.relationship('Meeting', foreign_keys='Meeting.user2_id', backref='user2',
                                cascade="all, delete-orphan")
    refusals = db.relationship('Refusal', backref='user', cascade="all, delete-orphan")
    matchs1 = db.relationship('Match', foreign_keys='Match.user1_id', backref='user1_match',
                               cascade="all, delete-orphan")
    matchs2 = db.relationship('Match', foreign_keys='Match.user2_id', backref='user2_match',
                               cascade="all, delete-orphan")
    interests = db.relationship('Interest', secondary='user_interest', back_populates='users')
    zodiac_sign = db.relationship('ZodiacSign', back_populates='users')
    gender_obj = db.relationship('Gender', backref='users')