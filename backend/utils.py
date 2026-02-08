import asyncio
from aiogram import Bot
from config import Config

bot = Bot(token=Config.TELEGRAM_BOT_TOKEN)

async def send_telegram_message(chat_id: str, text: str):
    await bot.send_message(chat_id=chat_id, text=text)

def init_db(db):
    """Initialize database with demo data"""
    from models import Niche
    
    if not Niche.query.first():
        niches = [Niche(name=n) for n in ['Красота', 'Технологии', 'Лайфстайл', 'Спорт', 'Еда']]
        db.session.add_all(niches)
        db.session.commit()