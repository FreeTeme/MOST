from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import SessionLocal
from models import Campaign, BloggerProfile, User

campaigns_bp = Blueprint("campaigns", __name__)

@campaigns_bp.route("/", methods=["GET"])
@jwt_required()
def get_campaigns():
    db = SessionLocal()
    user_id = get_jwt_identity()
    campaigns = db.query(Campaign).filter_by(owner_id=user_id).all()
    return jsonify([{
        "id": c.id,
        "name": c.name,
        "bloggers": [{"id": b.id, "profile_url": b.profile_url} for b in c.bloggers]
    } for c in campaigns])

@campaigns_bp.route("/", methods=["POST"])
@jwt_required()
def create_campaign():
    db = SessionLocal()
    user_id = get_jwt_identity()
    data = request.json

    campaign = Campaign(name=data["name"], owner_id=user_id)
    db.add(campaign)
    db.commit()
    return jsonify({"id": campaign.id, "message": "Campaign created"}), 201

@campaigns_bp.route("/<int:campaign_id>/add", methods=["POST"])
@jwt_required()
def add_blogger_to_campaign(campaign_id):
    db = SessionLocal()
    data = request.json
    blogger_id = data["blogger_id"]

    campaign = db.query(Campaign).filter_by(id=campaign_id).first()
    blogger = db.query(BloggerProfile).filter_by(id=blogger_id).first()

    if not campaign or not blogger:
        return jsonify({"error": "Not found"}), 404

    campaign.bloggers.append(blogger)
    db.commit()
    return jsonify({"message": "Blogger added"}), 200
