import secrets
from random import choice
from string import digits


def generate_numeric_code(length):
    return "".join(choice(digits) for _ in range(length))


def generate_token():
    return secrets.token_urlsafe(32)
