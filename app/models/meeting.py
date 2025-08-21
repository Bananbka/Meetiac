from datetime import date

from app.database import db


class Meeting(db.Model):
    __tablename__ = 'meetings'
    meeting_id = db.Column(db.Integer, primary_key=True)
    user1_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    user2_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=date.today)
    meeting_date = db.Column(db.DateTime(timezone=True), nullable=False)
    location = db.Column(db.String(100))
    user1_comment = db.Column(db.Text)
    user2_comment = db.Column(db.Text)
    result = db.Column(db.String(50))  # 'запланована', 'відбулася', 'відмова', 'успішна'
    archived = db.Column(db.Boolean, default=False)

    user1 = db.relationship(
        'User',
        foreign_keys=[user1_id],
        backref=db.backref('meetings_as_user1', cascade="all, delete-orphan")
    )

    user2 = db.relationship(
        'User',
        foreign_keys=[user2_id],
        backref=db.backref('meetings_as_user2', cascade="all, delete-orphan")
    )

    def to_dict(self, user_id=None):
        user1 = self.user1.to_dict(full=True)
        user2 = self.user2.to_dict(full=True)

        if user_id:
            is_user1 = user1["user_id"] == user_id

            requested_user = user1 if is_user1 else user2
            meet_user = user2 if is_user1 else user1

            req_comment = self.user1_comment if is_user1 else self.user2_comment
            meet_comment = self.user2_comment if is_user1 else self.user1_comment

            return {
                "meeting_id": self.meeting_id,
                "req_user": requested_user,
                "meet_user": meet_user,
                "created_at": self.created_at.isoformat() if self.created_at else None,
                "meeting_date": self.meeting_date.isoformat() if self.meeting_date else None,
                "location": self.location,
                "req_comment": req_comment,
                "meet_comment": meet_comment,
                "result": self.result,
                "archived": self.archived,
            }

        return {
            "meeting_id": self.meeting_id,
            "req_user": user1,
            "meet_user": user2,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "meeting_date": self.meeting_date.isoformat() if self.meeting_date else None,
            "location": self.location,
            "user1_comment": self.user1_comment,
            "user2_comment": self.user2_comment,
            "result": self.result,
            "archived": self.archived,
        }

    def is_user_belong(self, user_id:int) -> bool:
        return user_id == self.user1.user_id or user_id == self.user2.user_id