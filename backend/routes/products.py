from flask import request, jsonify
from . import products_bp
from models import Product, BloggerApplication, Social, Niche, User, db
import json

@products_bp.route('/catalog', methods=['GET'], endpoint='get_catalog_products')
def get_catalog_products():
    try:
        params = request.args
        user_id = params.get('user_id')
        search_filter = params.get('search', '').lower().strip()
        status_filter = params.get('status', 'Все')
        
        print(f"User ID: {user_id}, Search: {search_filter}, Status: {status_filter}")
        
        if not user_id:
            return jsonify({'error': 'user_id is required'}), 400
            
        user_id = int(user_id)
        
        # Проверяем существование пользователя
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Получаем ниши блогера из его социальных сетей
        blogger_socials = Social.query.filter_by(user_id=user_id).all()
        blogger_niches = set()
        
        for social in blogger_socials:
            for niche in social.niches:
                blogger_niches.add(niche.name.lower())
        
        print(f"Blogger niches: {blogger_niches}")
        
        result = []
        
        # Логика для разных статусов
        if status_filter == 'Все':
            # Показываем доступные продукты (без заявок от этого блогера)
            query = Product.query.filter_by(status='active')
            
            # Исключаем продукты, на которые уже есть заявки от этого блогера
            applied_product_ids = [app.product_id for app in BloggerApplication.query.filter_by(
                blogger_id=user_id
            ).all()]
            
            if applied_product_ids:
                query = query.filter(~Product.id.in_(applied_product_ids))
            
            # Фильтрация по нишам блогера
            matching_products = []
            for product in query.all():
                product_niches = []
                for niche in product.niches:
                    product_niches.append(niche.name.lower())
                
                # Проверяем совпадение ниш
                has_matching_niche = False
                matching_niches_list = []
                
                # Если у блогера есть ниши, проверяем совпадения
                if blogger_niches:
                    for blog_niche in blogger_niches:
                        for p_niche in product_niches:
                            # Проверяем частичное совпадение ниш
                            if (blog_niche in p_niche or p_niche in blog_niche or 
                                any(word in p_niche for word in blog_niche.split()) or
                                any(word in blog_niche for word in p_niche.split())):
                                has_matching_niche = True
                                matching_niches_list.append(niche.name)
                else:
                    # Если у блогера нет ниш, показываем все продукты
                    has_matching_niche = True
                
                if has_matching_niche:
                    # Проверяем поисковый запрос
                    if search_filter:
                        search_fields = [
                            product.name.lower(),
                            product.description.lower() if product.description else '',
                            product.brand.lower() if product.brand else '',
                            product.category.lower() if product.category else ''
                        ]
                        
                        search_fields.extend([niche.name.lower() for niche in product.niches])
                        
                        has_search_match = any(search_filter in field for field in search_fields if field)
                        
                        if has_search_match:
                            matching_products.append({
                                'product': product,
                                'matching_niches': list(set(matching_niches_list)) if matching_niches_list else []
                            })
                    else:
                        matching_products.append({
                            'product': product,
                            'matching_niches': list(set(matching_niches_list)) if matching_niches_list else []
                        })
            
            # Сортируем по релевантности (больше совпадающих ниш = выше)
            matching_products.sort(key=lambda x: len(x['matching_niches']), reverse=True)
            
            for match in matching_products:
                p = match['product']
                result.append({
                    'id': p.id,
                    'name': p.name,
                    'brand': p.brand,
                    'budget': p.budget,
                    'category': p.category,
                    'deadline': p.deadline.isoformat() if p.deadline else '',
                    'status': 'Доступен',
                    'description': p.description,
                    'niches': [niche.name for niche in p.niches],
                    'matching_niches': match['matching_niches']
                })
        
        else:
            status_map = {
                'Ожидание': 'pending',
                'В работе': 'accepted', 
                'Выполненные': 'completed'
            }
            
            application_status = status_map.get(status_filter)
            if not application_status:
                return jsonify({'error': 'Invalid status filter'}), 400
                
            applications = BloggerApplication.query.filter_by(
                blogger_id=user_id,
                status=application_status
            ).all()
            
            for app in applications:
                product = app.product
                
                if search_filter:
                    search_fields = [
                        product.name.lower(),
                        product.description.lower() if product.description else '',
                        product.brand.lower() if product.brand else '',
                        product.category.lower() if product.category else ''
                    ]
                    
                    has_search_match = any(search_filter in field for field in search_fields if field)
                    
                    if not has_search_match:
                        continue
                
                result.append({
                    'id': product.id,
                    'name': product.name,
                    'brand': product.brand,
                    'budget': product.budget,
                    'category': product.category,
                    'deadline': product.deadline.isoformat() if product.deadline else '',
                    'status': product.status,
                    'description': product.description,
                    'niches': [niche.name for niche in product.niches],
                    'application_status': app.status,
                    'applied_at': app.applied_at.isoformat()
                })
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Error in get_catalog_products: {str(e)}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@products_bp.route('', methods=['GET'], endpoint='get_products')
def get_products():
    params = request.args
    user_id = params.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'user_id is required'}), 400
        
    user_id = int(user_id)
    
    current_user_obj = User.query.get(user_id)
    
    if current_user_obj.role == 'advertiser':
        products = Product.query.filter_by(advertiser_id=user_id).all()
        return jsonify([{
            'id': p.id, 
            'name': p.name, 
            'budget': p.budget, 
            'status': p.status,
            'description': p.description,
            'category': p.category,
            'applications_count': len(p.applications)
        } for p in products])
    else:
        applications = BloggerApplication.query.filter_by(blogger_id=user_id).all()
        return jsonify([{
            'id': app.product.id,
            'name': app.product.name,
            'budget': app.product.budget,
            'status': app.status,
            'description': app.product.description,
            'category': app.product.category,
            'applied_at': app.applied_at.isoformat(),
            'product_status': app.product.status
        } for app in applications])

@products_bp.route('', methods=['POST'], endpoint='add_product')
def add_product():
    data = request.json
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'user_id is required'}), 400
    
    new_product = Product(
        advertiser_id=user_id,
        name=data['name'],
        brand=data.get('brand'),
        budget=data['budget'],
        deadline=data.get('deadline'),
        description=data.get('description'),
        payment_type=data.get('payment_type', 'money'),
        status='active',
        category=data.get('category', 'Другое'),
        target_niches=json.dumps(data.get('target_niches', []))
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify({'id': new_product.id}), 201

@products_bp.route('/<int:product_id>', methods=['PUT'], endpoint='update_product')
def update_product_status(product_id):
    data = request.json
    product = Product.query.get(product_id)
    
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    if 'status' in data:
        product.status = data['status']
    
    db.session.commit()
    return jsonify({'message': 'Product updated'})

@products_bp.route('/bloggers', methods=['GET'], endpoint='get_catalog_bloggers')
def get_catalog_bloggers():
    try:
        # Базовая реализация каталога блогеров
        users = User.query.filter_by(role='blogger').all()
        
        result = []
        for user in users:
            user_socials = Social.query.filter_by(user_id=user.id).all()
            
            for social in user_socials:
                result.append({
                    'id': social.id,
                    'name': user.username,
                    'platform': social.platform,
                    'followers': social.followers,
                    'region': social.region,
                    'price': social.price,
                    'categories': [niche.name for niche in social.niches],
                    'er': 4.5,  # Примерное значение
                    'link': social.link
                })
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Error in get_catalog_bloggers: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500