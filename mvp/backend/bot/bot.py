import asyncio
import threading
from aiogram import Bot, Dispatcher
from aiogram.filters import Command
from aiogram.types import Message, KeyboardButton, ReplyKeyboardMarkup, WebAppInfo
from config import Config

bot = Bot(token=Config.TELEGRAM_BOT_TOKEN)
dp = Dispatcher()

@dp.message(Command("start"))
async def start_handler(message: Message):
    await message.reply(f"Your Telegram ID is {message.chat.id}. Please use this ID in the app to authenticate.")
    
    kb = [[
        KeyboardButton(
            text="Open Site",
            web_app=WebAppInfo(url=Config.WEB_APP_URL),
        )
    ]]
    
    reply_markup = ReplyKeyboardMarkup(
        keyboard=kb,
        resize_keyboard=True,
    )
    await message.answer("Click the button to open the site:", reply_markup=reply_markup)

@dp.message(Command("open"))
async def open_handler(message: Message):
    kb = [[
        KeyboardButton(
            text="Open Site",
            web_app=WebAppInfo(url=Config.WEB_APP_URL),
        )
    ]]
    
    reply_markup = ReplyKeyboardMarkup(
        keyboard=kb,
        resize_keyboard=True,
    )
    await message.answer("Click the button to open the site:", reply_markup=reply_markup)

def run_bot_polling():
    """Run bot in separate thread"""
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    try:
        loop.run_until_complete(dp.run_polling(bot))
    except Exception as e:
        print(f"Bot polling error: {e}")
    finally:
        loop.close()

def start_bot():
    """Start bot in background thread"""
    thread = threading.Thread(target=run_bot_polling, daemon=True)
    thread.start()