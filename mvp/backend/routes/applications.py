from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import applications_bp
from models import BloggerApplication, Product, User, db
from utils import send_telegram_message
import asyncio

@applications_bp.route('', methods=['POST'])
@jwt_required()
def apply_to_product():
    data = request.json
    current_user = get_jwt_identity()
    
    product = Product.query.get(data['product_id'])
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    new_app = BloggerApplication(
        blogger_id=current_user['id'],
        product_id=data['product_id']
    )
    db.session.add(new_app)
    db.session.commit()
    
    # Notify advertiser via Telegram
    advertiser = product.advertiser
    blogger = User.query.get(current_user['id'])
    
    if advertiser.telegram_id:
        message = f"Blogger {blogger.username} has applied to your campaign {product.name}."
        asyncio.run(send_telegram_message(advertiser.telegram_id, message))
    
    return jsonify({'message': 'Applied'}), 201

@applications_bp.route('/my_applications', methods=['GET'])
@jwt_required()
def my_applications():
    current_user = get_jwt_identity()
    applications = BloggerApplication.query.filter_by(blogger_id=current_user['id']).all()
    
    return jsonify([{
        'id': a.id,
        'product_id': a.product_id,
        'product_name': a.product.name,
        'status': a.status,
        'applied_at': a.applied_at.isoformat()
    } for a in applications])

@applications_bp.route('/<int:app_id>', methods=['PUT'])
@jwt_required()
def manage_application(app_id):
    application = BloggerApplication.query.get(app_id)
    if not application:
        return jsonify({'error': 'Not found'}), 404
    
    data = request.json
    action = data.get('action')
    blogger = application.blogger
    
    if action == 'accept':
        application.status = 'accepted'
        application.product.status = 'started'
        message = f"Your application to {application.product.name} has been accepted. Campaign started."
    elif action == 'reject':
        application.status = 'rejected'
        message = f"Your application to {application.product.name} has been rejected."
    else:
        return jsonify({'error': 'Invalid action'}), 400
    
    if blogger.telegram_id:
        asyncio.run(send_telegram_message(blogger.telegram_id, message))
    
    db.session.commit()
    return jsonify({'message': f'Application {action}ed'})