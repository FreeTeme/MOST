from flask import Flask, render_template, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
import os

from config import Config
from models import db
from utils import init_db
from bot.bot import start_bot

from routes import (
    socials_bp, products_bp, reviews_bp, 
    applications_bp, admin_bp, profile_bp, auth_bp
)

def create_app():
    app = Flask(__name__, static_folder='static', template_folder='templates')
    app.config.from_object(Config)
    
    # Initialize extensions
    db.init_app(app)
    Migrate(app, db)
    jwt = JWTManager(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Register blueprints
    app.register_blueprint(socials_bp, url_prefix="/api/socials")
    app.register_blueprint(products_bp, url_prefix="/api/products")
    app.register_blueprint(reviews_bp, url_prefix="/api/reviews")
    app.register_blueprint(applications_bp, url_prefix="/api/applications")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(profile_bp, url_prefix="/api/profile")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    
    # Initialize database
    with app.app_context():
        if not os.path.exists('database.db'):
            db.create_all()
            init_db(db)
    
    # Serve React SPA
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_react(path):
        if path.startswith('api/'):
            return {'error': 'Not found'}, 404
        if os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        return render_template('index.html')
    
    return app

if __name__ == '__main__':
    app = create_app()
    
    # Start Telegram bot
    start_bot()
    
    app.run(debug=True)