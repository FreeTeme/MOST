from flask import Flask
from flask_cors import CORS
from database import Base, engine
from routes.auth import auth_bp
from routes.bloggers import bloggers_bp
from routes.campaigns import campaigns_bp

app = Flask(__name__)
CORS(app)

# Создание таблиц
Base.metadata.create_all(bind=engine)

# Роуты
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(bloggers_bp, url_prefix="/api/bloggers")
app.register_blueprint(campaigns_bp, url_prefix="/api/campaigns")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
