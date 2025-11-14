import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///database.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = 'super-secret-key-change-in-prod'
    TELEGRAM_BOT_TOKEN = '8311480105:AAEk6RJ8BbrjCT5qnRMHvLXZEgIV2zzCu0Y'
    WEB_APP_URL = 'https://your-frontend-url.com'