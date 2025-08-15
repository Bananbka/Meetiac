from datetime import date

from sqlalchemy import func

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
    refusals = db.relationship('Refusal', backref='user', cascade="all, delete-orphan")

    interests = db.relationship('Interest', secondary='user_interest', back_populates='users')
    zodiac_sign = db.relationship('ZodiacSign', back_populates='users')
    gender_obj = db.relationship('Gender', backref='users')
    images = db.relationship('UserImage', backref='user')

    def to_dict(self, fields=None, full=False):
        if fields is None:
            fields = []

        if full:
            fields = ['birth_date', 'age', 'gender', 'height',
                      'weight', 'sign', "bio", "images",
                      "interests", "is_active", "registration_date"]

        data = {
            "user_id": self.user_id,
            "name": f"{self.first_name} {self.last_name}"
        }
        if "birth_date" in fields:
            data["birth_date"] = self.birth_date.isoformat() if self.birth_date else None

        if "age" in fields:
            data["age"] = self.get_age()

        if "gender" in fields:
            data["gender"] = self.gender_obj.name if self.gender_obj else None

        if "height" in fields:
            data["height"] = self.height

        if "weight" in fields:
            data["weight"] = self.weight

        if "sign" in fields:
            data["sign"] = self.zodiac_sign.name if self.zodiac_sign else None

        if "bio" in fields:
            data["bio"] = self.bio

        if "images" in fields:
            # data["images"] = ['static/uploads/user_2_0.png', 'static/uploads/user_2_1.png',
            #                   'static/uploads/user_2_2.png']
            # import random
            # random.shuffle(data["images"])

            if len(self.images) != 0:
                data["images"] = [img.image_path for img in self.images]
            else:
                data["images"] = ["static/uploads/blank.jpg"]

        if "interests" in fields:
            # data["interests"] = ["Подорожі"]
            data["interests"] = [interest.name for interest in self.interests]

        if "is_active" in fields:
            data["is_active"] = self.is_active

        if "registration_date" in fields:
            data["registration_date"] = self.registration_date.isoformat() if self.registration_date else None

        return data

    def get_age(self):
        if self.birth_date:
            today = date.today()
            return today.year - self.birth_date.year - (
                    (today.month, today.day) < (self.birth_date.month, self.birth_date.day)
            )
        return None
