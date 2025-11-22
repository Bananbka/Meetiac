import os
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from dotenv import load_dotenv

# Завантажуємо змінні середовища, якщо є .env файл
load_dotenv()

# Налаштування (можна брати з .env або задати дефолтні)
DB_HOST = os.getenv("POSTGRES_HOST", "localhost")
DB_USER = os.getenv("POSTGRES_USER", "postgres")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "your_password") # Викладач може змінити це в .env
DB_NAME = os.getenv("POSTGRES_DB", "meetiac_db")
BACKUP_FILE = "backup.sql" # Назва вашого файлу з дампом

def create_database():
    try:
        # Підключення до системної бази 'postgres' для створення нової БД
        con = psycopg2.connect(
            dbname="postgres",
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST
        )
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = con.cursor()

        # Перевіряємо, чи існує база
        cursor.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{DB_NAME}'")
        exists = cursor.fetchone()

        if not exists:
            print(f"Створення бази даних '{DB_NAME}'...")
            cursor.execute(f"CREATE DATABASE {DB_NAME}")
            print("Базу даних успішно створено.")
        else:
            print(f"База даних '{DB_NAME}' вже існує.")

        cursor.close()
        con.close()
        return True

    except Exception as e:
        print(f"Помилка при створенні БД: {e}")
        print("Перевірте правильність логіна/пароля у файлі .env")
        return False

def restore_backup():
    if not os.path.exists(BACKUP_FILE):
        print(f"Файл бекапу '{BACKUP_FILE}' не знайдено!")
        return

    try:
        print(f"Відновлення даних з '{BACKUP_FILE}'...")
        
        # Підключення до новоствореної бази
        con = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST
        )
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = con.cursor()

        # Читаємо SQL файл і виконуємо його
        with open(BACKUP_FILE, 'r', encoding='utf-8') as f:
            sql_script = f.read()
            cursor.execute(sql_script)

        print("Дані успішно відновлено!")
        cursor.close()
        con.close()

    except Exception as e:
        print(f"Помилка при відновленні даних: {e}")

if __name__ == "__main__":
    print("--- Автоматичне налаштування бази даних Meetiac ---")
    if create_database():
        restore_backup()
    print("--- Налаштування завершено ---")