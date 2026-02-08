from flask import request, jsonify
from . import socials_bp
from models import Social, Niche, User, db
import json

@socials_bp.route('', methods=['GET'])
def get_socials():
    try:
        user_id = request.args.get('user_id')
        
        if not user_id:
            return jsonify({'error': 'user_id is required'}), 400
            
        user_id = int(user_id)
        
        socials = Social.query.filter_by(user_id=user_id).all()
        
        result = []
        for social in socials:
            result.append({
                'id': social.id,
                'platform': social.platform,
                'followers': social.followers,
                'region': social.region,
                'price': social.price,
                'link': social.link,
                'niches': [niche.name for niche in social.niches],
                'created_at': social.created_at.isoformat() if social.created_at else None
            })
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Error in get_socials: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@socials_bp.route('', methods=['POST'])
def add_social():
    try:
        data = request.json
        user_id = data.get('user_id')
        
        if not user_id:
            return jsonify({'error': 'user_id is required'}), 400
        
        # Проверка обязательных полей
        required_fields = ['platform', 'followers', 'region', 'price', 'link']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
            
        # Создаем социальную сеть
        new_social = Social(
            user_id=user_id,
            platform=data['platform'],
            followers=data['followers'],
            region=data['region'],
            price=data['price'],
            link=data['link']
        )
        
        # Обрабатываем ниши
        niches_input = data.get('niches', '')
        if niches_input:
            if isinstance(niches_input, list):
                niche_names = niches_input
            else:
                niche_names = [name.strip() for name in niches_input.split(',')]
            for niche_name in niche_names:
                if niche_name:  # Пропускаем пустые строки
                    niche = Niche.query.filter_by(name=niche_name).first()
                    if not niche:
                        niche = Niche(name=niche_name)
                        db.session.add(niche)
                    new_social.niches.append(niche)
        
        db.session.add(new_social)
        db.session.commit()
        
        return jsonify({
            'message': 'Social added successfully',
            'id': new_social.id,
            'platform': new_social.platform,
            'followers': new_social.followers,
            'region': new_social.region,
            'price': new_social.price,
            'link': new_social.link,
            'niches': [niche.name for niche in new_social.niches]
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error in add_social: {str(e)}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@socials_bp.route('/<int:social_id>', methods=['PUT'])
def update_social(social_id):
    try:
        data = request.json
        social = Social.query.get(social_id)
        
        if not social:
            return jsonify({'error': 'Social not found'}), 404
            
        # Обновляем поля
        if 'platform' in data:
            social.platform = data['platform']
        if 'followers' in data:
            social.followers = data['followers']
        if 'region' in data:
            social.region = data['region']
        if 'price' in data:
            social.price = data['price']
        if 'link' in data:
            social.link = data['link']
            
        # Обновляем ниши
        if 'niches' in data:
            social.niches.clear()
            niches_input = data['niches']
            if isinstance(niches_input, list):
                niche_names = niches_input
            else:
                niche_names = [name.strip() for name in niches_input.split(',')]
            for niche_name in niche_names:
                if niche_name:  # Пропускаем пустые строки
                    niche = Niche.query.filter_by(name=niche_name).first()
                    if not niche:
                        niche = Niche(name=niche_name)
                        db.session.add(niche)
                    social.niches.append(niche)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Social updated successfully',
            'id': social.id,
            'platform': social.platform,
            'followers': social.followers,
            'region': social.region,
            'price': social.price,
            'link': social.link,
            'niches': [niche.name for niche in social.niches]
        })
        
    except Exception as e:
        db.session.rollback()
        print(f"Error in update_social: {str(e)}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500
    
@socials_bp.route('/<int:social_id>', methods=['DELETE'])
def delete_social(social_id):
    try:
        social = Social.query.get(social_id)
        
        if not social:
            return jsonify({'error': 'Social not found'}), 404
            
        db.session.delete(social)
        db.session.commit()
        
        return jsonify({'message': 'Social deleted successfully'})
        
    except Exception as e:
        db.session.rollback()
        print(f"Error in delete_social: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500