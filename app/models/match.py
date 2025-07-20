from datetime import date

from app.database import db


class Match(db.Model):
    __tablename__ = 'matches'
    match_id = db.Column(db.Integer, primary_key=True)
    user1_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    user2_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    created_at = db.Column(db.Date, default=date.today)
    archived = db.Column(db.Boolean, default=False)
    comment = db.Column(db.Text)

    user1 = db.relationship(
        'User',
        foreign_keys=[user1_id],
        backref=db.backref('matches_as_user1', cascade="all, delete-orphan"),
        overlaps="matches_as_user2,user2"
    )
    user2 = db.relationship(
        'User',
        foreign_keys=[user2_id],
        backref=db.backref('matches_as_user2', cascade="all, delete-orphan"),
        overlaps="matches_as_user1,user1"
    )

    def to_dict(self):
        return {
            "match_id": self.match_id,
            "user1": self.user1.to_dict(full=True),
            "user2": self.user2.to_dict(full=True),
            "created_at": self.created_at,
            "archived": self.archived,
            "comment": self.comment,
        }
