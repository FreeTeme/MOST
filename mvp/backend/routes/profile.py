# routes/profile.py
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import profile_bp
from models import User, db

@profile_bp.route('', methods=['GET'])
@jwt_required()
def get_profile():
    """Получить профиль текущего пользователя"""
    current_user = get_jwt_identity()
    
    user = User.query.get(current_user['id'])
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role,
        'telegram_id': user.telegram_id,
        'views': user.views,
        'created_at': user.created_at.isoformat()
    })

@profile_bp.route('', methods=['PUT'])
@jwt_required()
def update_profile():
    """Обновить профиль пользователя"""
    current_user = get_jwt_identity()
    data = request.json
    
    user = User.query.get(current_user['id'])
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Обновляем только разрешенные поля
    allowed_fields = ['telegram_id', 'username', 'email']
    for field in allowed_fields:
        if field in data:
            setattr(user, field, data[field])
    
    try:
        db.session.commit()
        return jsonify({
            'message': 'Profile updated successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'telegram_id': user.telegram_id
            }
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@profile_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_profile_stats():
    """Получить статистику профиля"""
    current_user = get_jwt_identity()
    
    user = User.query.get(current_user['id'])
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Статистика для блогера
    if user.role == 'blogger':
        total_socials = len(user.socials)
        total_followers = sum(social.followers for social in user.socials)
        total_reviews = len(user.reviews_received)
        avg_rating = sum(review.rating for review in user.reviews_received) / len(user.reviews_received) if user.reviews_received else 0
        
        return jsonify({
            'total_socials': total_socials,
            'total_followers': total_followers,
            'total_reviews': total_reviews,
            'avg_rating': round(avg_rating, 2),
            'total_applications': len(user.applications)
        })
    
    # Статистика для рекламодателя
    elif user.role == 'advertiser':
        total_products = len(user.products)
        total_applications_received = sum(len(product.applications) for product in user.products)
        
        return jsonify({
            'total_products': total_products,
            'total_applications_received': total_applications_received
        })
    
    return jsonify({'error': 'Unknown role'}), 400