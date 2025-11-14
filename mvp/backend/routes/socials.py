from flask import request, jsonify
from . import socials_bp
from models import Social, User, Niche, db

# Эндпоинты для работы со СВОИМИ социальными сетями
@socials_bp.route('', methods=['GET'])
def get_my_socials():
    """Получить социальные сети текущего пользователя"""
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'user_id is required'}), 400
    
    socials = Social.query.filter_by(user_id=user_id).all()
    
    return jsonify([{
        'id': s.id,
        'user_id': s.user_id,
        'platform': s.platform,
        'followers': s.followers,
        'region': s.region,
        'price': s.price,
        'link': s.link,
        'created_at': s.created_at.isoformat() if s.created_at else None,
        'niches': [niche.name for niche in s.niches],
        'engagement': calculate_engagement(s)  # Рассчитываем ER из метрик
    } for s in socials])

@socials_bp.route('', methods=['POST'])
def add_social():
    """Добавить социальную сеть для текущего пользователя"""
    data = request.json
    
    required_fields = ['user_id', 'platform', 'followers', 'region', 'price', 'link']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    new_social = Social(
        user_id=data['user_id'],
        platform=data['platform'],
        followers=data['followers'],
        region=data['region'],
        price=data['price'],
        link=data['link']
    )
    
    # Добавляем ниши если переданы
    if 'niches' in data:
        for niche_name in data['niches']:
            niche = Niche.query.filter_by(name=niche_name).first()
            if niche:
                new_social.niches.append(niche)
    
    try:
        db.session.add(new_social)
        db.session.commit()
        return jsonify({
            'id': new_social.id,
            'message': 'Social media added successfully'
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@socials_bp.route('/<int:id>', methods=['PUT'])
def update_social(id):
    """Обновить социальную сеть"""
    social = Social.query.get(id)
    if not social:
        return jsonify({'error': 'Social media not found'}), 404
    
    data = request.json
    allowed_fields = ['platform', 'followers', 'region', 'price', 'link']
    
    for field in allowed_fields:
        if field in data:
            setattr(social, field, data[field])
    
    # Обновляем ниши если переданы
    if 'niches' in data:
        social.niches = []
        for niche_name in data['niches']:
            niche = Niche.query.filter_by(name=niche_name).first()
            if niche:
                social.niches.append(niche)
    
    try:
        db.session.commit()
        return jsonify({'message': 'Social media updated successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@socials_bp.route('/<int:id>', methods=['DELETE'])
def delete_social(id):
    """Удалить социальную сеть"""
    social = Social.query.get(id)
    if not social:
        return jsonify({'error': 'Social media not found'}), 404
    
    try:
        db.session.delete(social)
        db.session.commit()
        return jsonify({'message': 'Social media deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Эндпоинты для КАТАЛОГА (все социальные сети всех пользователей)
@socials_bp.route('/catalog', methods=['GET'])
def get_socials_catalog():
    """Получить все социальные сети для каталога (поиска)"""
    params = request.args
    
    # Базовый запрос
    query = Social.query.join(User).filter(User.role == 'blogger')
    
    # Фильтры
    platform = params.get('platform')
    if platform and platform != 'all':
        query = query.filter(Social.platform == platform)
    
    category = params.get('category')
    if category and category != 'all':
        query = query.join(Social.niches).filter(Niche.name == category)
    
    region = params.get('region')
    if region and region != 'all':
        query = query.filter(Social.region == region)
    
    # Фильтры по диапазону
    min_followers = params.get('min_followers', type=int)
    if min_followers:
        query = query.filter(Social.followers >= min_followers)
    
    max_followers = params.get('max_followers', type=int)
    if max_followers:
        query = query.filter(Social.followers <= max_followers)
    
    min_price = params.get('min_price', type=int)
    if min_price:
        query = query.filter(Social.price >= min_price)
    
    max_price = params.get('max_price', type=int)
    if max_price:
        query = query.filter(Social.price <= max_price)
    
    # Поиск
    search = params.get('search')
    if search:
        query = query.join(User).filter(
            User.username.ilike(f'%{search}%') |
            Social.platform.ilike(f'%{search}%')
        )
    
    # Лимит для пагинации/превью
    limit = params.get('limit', type=int)
    if limit:
        query = query.limit(limit)
    
    socials = query.all()
    
    return jsonify([{
        'id': s.id,
        'user_id': s.user_id,
        'username': s.user.username,
        'platform': s.platform,
        'followers': s.followers,
        'region': s.region,
        'price': s.price,
        'link': s.link,
        'engagement': calculate_engagement(s),
        'categories': [niche.name for niche in s.niches],
        'created_at': s.created_at.isoformat() if s.created_at else None
    } for s in socials])

@socials_bp.route('/platforms', methods=['GET'])
def get_platforms():
    """Получить список всех доступных платформ"""
    platforms = db.session.query(Social.platform).distinct().all()
    return jsonify([p[0] for p in platforms])

@socials_bp.route('/regions', methods=['GET'])
def get_regions():
    """Получить список всех регионов"""
    regions = db.session.query(Social.region).distinct().all()
    return jsonify([r[0] for r in regions])

def calculate_engagement(social):
    """Рассчитать engagement rate из метрик"""
    if not social.metrics:
        return 0.0
    
    # Берем последние метрики или среднее значение
    latest_metric = social.metrics[-1] if social.metrics else None
    if latest_metric:
        return latest_metric.er
    
    # Или рассчитываем из лайков/комментариев
    total_engagement = sum(metric.likes + metric.comments for metric in social.metrics)
    if social.followers > 0 and social.metrics:
        avg_engagement = total_engagement / len(social.metrics)
        return round((avg_engagement / social.followers) * 100, 2)
    
    return 0.0