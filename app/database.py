from datetime import datetime, UTC, timedelta

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def default_expire():
    return datetime.now(UTC) + timedelta(minutes=15)


def default_utc_now():
    return datetime.now(UTC)
