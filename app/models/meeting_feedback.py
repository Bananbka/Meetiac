from datetime import datetime, UTC

from app.database import db, default_utc_now


class MeetingFeedback(db.Model):
    __tablename__ = 'meeting_feedbacks'

    feedback_id = db.Column(db.Integer, primary_key=True)
    meeting_id = db.Column(db.Integer, db.ForeignKey('meetings.meeting_id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    comment = db.Column(db.Text, nullable=False)
    was_successful = db.Column(db.Boolean, nullable=False)
    stay_together = db.Column(db.Boolean, default=False)
    partner_late = db.Column(db.Boolean, default=False)

    created_at = db.Column(db.DateTime(timezone=True), default=default_utc_now)

    meeting = db.relationship('Meeting', backref=db.backref('feedback', uselist=False, cascade='all, delete-orphan'))

    def to_dict(self):
        return {
            'feedback_id': self.feedback_id,
            'meeting_id': self.meeting_id,
            'user_id': self.user_id,
            'comment': self.comment,
            'was_successful': self.was_successful,
            'stay_together': self.stay_together,
            'partner_late': self.partner_late,
            'created_at': self.created_at
        }