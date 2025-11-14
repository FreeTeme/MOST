from flask import request, jsonify
from flask_jwt_extended import jwt_required
from . import products_bp
from models import Product, db

@products_bp.route('', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([{
        'id': p.id, 
        'name': p.name, 
        'budget': p.budget, 
        'status': p.status
    } for p in products])

@products_bp.route('', methods=['POST'])
@jwt_required()
def add_product():
    data = request.json
    new_product = Product(
        advertiser_id=data['advertiser_id'],
        name=data['name'],
        brand=data.get('brand'),
        budget=data['budget'],
        deadline=data.get('deadline'),
        description=data.get('description'),
        payment_type=data.get('payment_type', 'money')
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify({'id': new_product.id}), 201

@products_bp.route('/catalog', methods=['GET'])
def get_catalog_products():
    params = request.args
    status = params.get('status', 'Все')
    category = params.get('category', 'all')
    
    query = Product.query
    
    if category != 'all':
        query = query.join(Product.niches).filter_by(name=category)
    
    if status != 'Все':
        query = query.filter_by(status=status)
    
    products = query.all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'brand': p.brand,
        'budget': p.budget,
        'category': [n.name for n in p.niches][0] if p.niches else '',
        'deadline': p.deadline.isoformat() if p.deadline else '',
        'status': p.status
    } for p in products])