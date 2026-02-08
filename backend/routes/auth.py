from flask import request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash
from . import auth_bp
from models import User, db

@auth_bp.route('/telegram', methods=['POST'])
def telegram_auth():
    data = request.json
    telegram_id = data.get('telegram_id')
    
    if not telegram_id:
        return jsonify({'error': 'Telegram ID required'}), 400
    
    user = User.query.filter_by(telegram_id=telegram_id).first()
    
    if not user:
        # Create new user with telegram auth
        username = f"user_{telegram_id}"
        email = f"{telegram_id}@telegram.com"
        user = User(
            username=username,
            email=email,
            password_hash=generate_password_hash(telegram_id),
            role='blogger',
            telegram_id=telegram_id
        )
        db.session.add(user)
        db.session.commit()
    
    access_token = create_access_token(identity={
        'id': user.id,
        'username': user.username,
        'role': user.role
    })
    
    return jsonify({
        'access_token': access_token,
        'user': {
            'id': user.id,
            'username': user.username,
            'role': user.role,
            'telegram_id': user.telegram_id
        }
    })