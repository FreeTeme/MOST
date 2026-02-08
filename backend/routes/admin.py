from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import admin_bp
from models import User, Metrics, db

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def admin_users():
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({'error': 'Unauthorized'}), 401
    
    users = User.query.all()
    return jsonify([{
        'id': u.id,
        'username': u.username,
        'role': u.role,
        'email': u.email
    } for u in users])

@admin_bp.route('/analytics', methods=['GET'])
@jwt_required()
def admin_analytics():
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({'error': 'Unauthorized'}), 401
    
    total_users = User.query.count()
    avg_er = db.session.query(db.func.avg(Metrics.er)).scalar() or 0
    
    return jsonify({
        'total_users': total_users,
        'avg_er': avg_er
    })