from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import SessionLocal
from models import BloggerProfile, User

bloggers_bp = Blueprint("bloggers", __name__)

@bloggers_bp.route("/", methods=["GET"])
def get_bloggers():
    db = SessionLocal()
    bloggers = db.query(BloggerProfile).all()
    return jsonify([{
        "id": b.id,
        "user_id": b.user_id,
        "platform": b.platform,
        "profile_url": b.profile_url,
        "subscribers": b.subscribers,
        "er": b.er,
        "category": b.category,
        "price": b.price,
        "content_example": b.content_example
    } for b in bloggers])

@bloggers_bp.route("/", methods=["POST"])
@jwt_required()
def create_blogger():
    db = SessionLocal()
    user_id = get_jwt_identity()
    data = request.json

    blogger = BloggerProfile(
        user_id=user_id,
        platform=data["platform"],
        profile_url=data["profile_url"],
        subscribers=data["subscribers"],
        er=data.get("er", "0"),
        category=data["category"],
        price=data["price"],
        content_example=data.get("content_example", "")
    )
    db.add(blogger)
    db.commit()
    return jsonify({"message": "Blogger profile created"}), 201
