from datetime import date
from operator import or_, and_

from app.database import db
from app.models.zodiac_compatibility import ZodiacCompatibility


class Match(db.Model):
    __tablename__ = 'matches'
    match_id = db.Column(db.Integer, primary_key=True)
    user1_id = db.Column(db.Integer, db.ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    user2_id = db.Column(db.Integer, db.ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
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

    def to_dict(self, user_id=None):
        user1 = self.user1.to_dict(full=True)
        user2 = self.user2.to_dict(full=True)

        comp_data = (
            ZodiacCompatibility.query.filter(
                or_(
                    and_(
                        ZodiacCompatibility.sign1_id == self.user1.sign_id,
                        ZodiacCompatibility.sign2_id == self.user2.sign_id,
                    ),
                    and_(
                        ZodiacCompatibility.sign1_id == self.user2.sign_id,
                        ZodiacCompatibility.sign2_id == self.user1.sign_id,
                    ),
                )
            )
            .first()
        )

        if user_id:
            if user1["user_id"] == user_id:
                requested_user = user1
                match_user = user2
            else:
                requested_user = user2
                match_user = user1

            return {
                "match_id": self.match_id,
                "req_user": requested_user,
                "match_user": match_user,
                "created_at": self.created_at,
                "archived": self.archived,
                "comment": self.comment,
                "score": comp_data.percent
            }

        return {
            "match_id": self.match_id,
            "req_user": user1,
            "match_user": user2,
            "created_at": self.created_at,
            "archived": self.archived,
            "comment": self.comment,
            "score": comp_data.percent
        }
