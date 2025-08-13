from app.database import db, default_expire


class RestoreCode(db.Model):
    __tablename__ = 'restore_code'

    id = db.Column(db.Integer, primary_key=True)
    creds_id = db.Column(db.Integer, db.ForeignKey('credentials.key_id'))
    code = db.Column(db.String(6), nullable=False)
    expire_at = db.Column(db.DateTime, nullable=False, default=default_expire)

    creds = db.relationship('Credentials', backref='restore_code')
