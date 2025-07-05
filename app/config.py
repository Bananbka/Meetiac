import os

from dotenv import load_dotenv

load_dotenv()


class Config:
    SQLALCHEMY_DATABASE_URI = (f"postgresql://"
                               f"{os.getenv("POSTGRES_USER")}:{os.getenv("POSTGRES_PASSWORD")}"
                               f"@localhost/{os.getenv("POSTGRES_DB")}")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
