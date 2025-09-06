from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from database import SessionLocal
from models import User

auth_bp = Blueprint("auth", __name__)
jwt = JWTManager()

@auth_bp.record_once
def setup_jwt(state):
    app = state.app
    app.config["JWT_SECRET_KEY"] = "super-secret"  # вынести в .env
    jwt.init_app(app)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    db = SessionLocal()

    if db.query(User).filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already registered"}), 400

    user = User(
        email=data["email"],
        password=generate_password_hash(data["password"]),
        role=data.get("role", "advertiser")
    )
    db.add(user)
    db.commit()
    return jsonify({"message": "User created"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    db = SessionLocal()
    user = db.query(User).filter_by(email=data["email"]).first()

    if not user or not check_password_hash(user.password, data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(identity=user.id)
    return jsonify({"token": token, "role": user.role})
