from app.database import db, default_utc_now


class Dislike(db.Model):
    __tablename__ = 'dislike'

    id = db.Column(db.Integer, primary_key=True)
    from_user_id = db.Column(db.Integer, db.ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    to_user_id = db.Column(db.Integer, db.ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=default_utc_now, nullable=False)

    from_user = db.relationship('User', foreign_keys=[from_user_id])
    to_user = db.relationship('User', foreign_keys=[to_user_id])

    def to_dict(self):
        return {
            'id': self.id,
            'created_at': self.created_at,
            'from_user_id': self.from_user_id,
            'to_user_id': self.to_user_id,
            'to_user': self.to_user.to_dict(['images']),
        }
