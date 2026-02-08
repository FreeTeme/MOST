from flask import request, jsonify
from . import applications_bp
from models import BloggerApplication, Product, User, db
from utils import send_telegram_message
import asyncio
from datetime import datetime

@applications_bp.route('', methods=['POST'], endpoint='apply_to_product')
def apply_to_product():
    data = request.json
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'user_id is required'}), 400
        
    product_id = data.get('product_id')
    if not product_id:
        return jsonify({'error': 'product_id is required'}), 400
    
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    # Проверяем, не подавал ли уже заявку
    existing_app = BloggerApplication.query.filter_by(
        blogger_id=user_id,
        product_id=product_id
    ).first()
    
    if existing_app:
        return jsonify({'error': 'You have already applied to this product'}), 400
    
    # Создаем заявку
    new_app = BloggerApplication(
        blogger_id=user_id,
        product_id=product_id,
        status='pending'
    )
    
    db.session.add(new_app)
    db.session.commit()
    
    # Уведомляем рекламодателя
    advertiser = product.advertiser
    blogger = User.query.get(user_id)
    
    if advertiser.telegram_id:
        message = f"🎯 Новый отклик!\nБлогер: {blogger.username}\nКампания: {product.name}\nСтатус: Ожидает решения"
        asyncio.run(send_telegram_message(advertiser.telegram_id, message))
    
    return jsonify({
        'message': 'Application submitted successfully',
        'application_id': new_app.id
    }), 201

@applications_bp.route('/my_applications', methods=['GET'], endpoint='my_applications')
def my_applications():
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'user_id is required'}), 400
        
    user_id = int(user_id)
    
    applications = BloggerApplication.query.filter_by(blogger_id=user_id).all()
    
    return jsonify([{
        'id': a.id,
        'product_id': a.product_id,
        'product_name': a.product.name,
        'product_budget': a.product.budget,
        'status': a.status,
        'applied_at': a.applied_at.isoformat(),
        'accepted_at': a.accepted_at.isoformat() if a.accepted_at else None
    } for a in applications])

@applications_bp.route('/product/<int:product_id>', methods=['GET'], endpoint='get_product_applications')
def get_product_applications(product_id):
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'user_id is required'}), 400
        
    user_id = int(user_id)
    
    product = Product.query.get(product_id)
    
    if not product or product.advertiser_id != user_id:
        return jsonify({'error': 'Product not found or access denied'}), 404
    
    applications = BloggerApplication.query.filter_by(product_id=product_id).all()
    
    return jsonify([{
        'id': app.id,
        'blogger_id': app.blogger_id,
        'blogger_name': app.blogger.username,
        'blogger_socials': [{
            'platform': s.platform,
            'followers': s.followers,
            'niches': [n.name for n in s.niches]
        } for s in app.blogger.socials],
        'status': app.status,
        'applied_at': app.applied_at.isoformat()
    } for app in applications])

@applications_bp.route('/<int:app_id>', methods=['PUT'], endpoint='manage_application')
def manage_application(app_id):
    application = BloggerApplication.query.get(app_id)
    if not application:
        return jsonify({'error': 'Application not found'}), 404
    
    data = request.json
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'user_id is required'}), 400
        
    user_id = int(user_id)
    
    product = application.product
    
    # Проверяем, что текущий пользователь - владелец продукта
    if product.advertiser_id != user_id:
        return jsonify({'error': 'Access denied'}), 403
    
    action = data.get('action')
    blogger = application.blogger
    
    if action == 'accept':
        application.status = 'accepted'
        application.accepted_at = datetime.utcnow()
        product.status = 'in_progress'
        message = f"✅ Ваша заявка на кампанию '{product.name}' принята! Кампания начата."
    
    elif action == 'reject':
        application.status = 'rejected'
        message = f"❌ Ваша заявка на кампанию '{product.name}' отклонена."
    
    elif action == 'complete':
        application.status = 'completed'
        application.completed_at = datetime.utcnow()
        message = f"🎉 Кампания '{product.name}' завершена! Спасибо за сотрудничество."
    
    else:
        return jsonify({'error': 'Invalid action'}), 400
    
    # Уведомляем блогера
    if blogger.telegram_id:
        asyncio.run(send_telegram_message(blogger.telegram_id, message))
    
    db.session.commit()
    return jsonify({'message': f'Application {action}ed', 'status': application.status})

@applications_bp.route('/blogger/stats', methods=['GET'], endpoint='blogger_applications_stats')
def blogger_applications_stats():
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'user_id is required'}), 400
        
    user_id = int(user_id)
    
    stats = {
        'pending': BloggerApplication.query.filter_by(blogger_id=user_id, status='pending').count(),
        'accepted': BloggerApplication.query.filter_by(blogger_id=user_id, status='accepted').count(),
        'completed': BloggerApplication.query.filter_by(blogger_id=user_id, status='completed').count(),
        'rejected': BloggerApplication.query.filter_by(blogger_id=user_id, status='rejected').count()
    }
    
    return jsonify(stats)