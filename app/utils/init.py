def init():
    from random import choice, randint, sample
    from faker import Faker
    from app.database import db
    from app.models import User, Credentials, Gender, ZodiacSign, PartnerPreference, PreferenceSign

    fake = Faker('uk_UA')

    # ⚠️ Створи або перевір, чи є gender та zodiac_sign
    def seed_static_data():
        if not Gender.query.first():
            genders = ['male', 'female']
            for idx, name in enumerate(genders):
                db.session.add(Gender(gender_id=idx + 1, name=name))
        if not ZodiacSign.query.first():
            signs = [
                'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
                'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
            ]
            for idx, name in enumerate(signs):
                db.session.add(ZodiacSign(sign_id=idx + 1, name=name))
        db.session.commit()

    # 👤 Створення користувачів
    def seed_users(n=100):
        genders = Gender.query.filter_by(Gender.name != "any").all()
        zodiac_signs = ZodiacSign.query.all()

        for i in range(n):
            gender = choice(genders)
            sign = choice(zodiac_signs)
            birth_year = randint(1985, 2005)
            birth_month = randint(1, 12)
            birth_day = randint(1, 28)  # без зайвих перевірок

            user = User(
                gender=gender.gender_id,
                first_name=fake.first_name_male() if gender.name == "male" else fake.first_name_female(),
                last_name=fake.last_name(),
                birth_date=fake.date_of_birth(tzinfo=None, minimum_age=18, maximum_age=40),
                height=randint(150, 200),
                weight=randint(50, 100),
                sign_id=sign.sign_id,
                bio=fake.text(max_nb_chars=200)
            )
            db.session.add(user)
            db.session.flush()  # Отримуємо user.user_id

            # 🔑 Облікові дані
            cred = Credentials(
                login=f"user{i}@example.com",
                user_id=user.user_id
            )
            cred.set_password("password123")
            db.session.add(cred)

            # ❤️ Партнерські вподобання
            preferred_gender = choice(genders)
            pref = PartnerPreference(
                user_id=user.user_id,
                gender_id=preferred_gender.gender_id,
                min_age=18,
                max_age=35,
                min_height=150,
                max_height=200,
                min_weight=50,
                max_weight=100
            )
            db.session.add(pref)
            db.session.flush()

            # 🌟 Улюблені знаки
            selected_signs = sample(zodiac_signs, randint(1, 3))
            for sign in selected_signs:
                pref_sign = PreferenceSign(
                    preference_id=pref.preference_id,
                    sign_id=sign.sign_id
                )
                db.session.add(pref_sign)

        db.session.commit()

    seed_static_data()
    seed_users(100)
    return "ok"
