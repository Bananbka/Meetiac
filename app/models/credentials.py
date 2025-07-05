from app.database import db


class Credentials(db.Model):
    __tablename__ = 'credentials'
    key_id = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)  # Хешований пароль
    access_right = db.Column(db.String(20))  # 'admin', 'operator', 'authorized', 'guest'