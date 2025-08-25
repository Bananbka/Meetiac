from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

from app.database import db


class Credentials(UserMixin, db.Model):
    __tablename__ = 'credentials'
    key_id = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)  # Хешований пароль
    access_right = db.Column(db.String(20))  # 'admin', 'operator', 'authorized', 'guest'

    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def get_id(self):
        return str(self.key_id)

    def to_dict(self, full=False):
        data = {
            "key_id": self.key_id,
            "login": self.login,
            "access_right": self.access_right,
            "user_id": self.user_id
        }
        if full:
            data["user"] = self.user.to_dict(fields=["gender", "sign", "is_active"]) if self.user else None
        return data
