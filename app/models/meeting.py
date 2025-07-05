from app.database import db


class Meeting(db.Model):
    __tablename__ = 'meetings'
    meeting_id = db.Column(db.Integer, primary_key=True)
    user1_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    user2_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    meeting_date = db.Column(db.Date)
    location = db.Column(db.String(100))
    result = db.Column(db.String(50))  # 'запланована', 'відбулася', 'відмова', 'успішна'