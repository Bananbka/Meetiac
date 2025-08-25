from app.database import db


class UserImage(db.Model):
    __tablename__ = 'user_images'

    user_image_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id', ondelete='CASCADE'))
    image_path = db.Column(db.String)

