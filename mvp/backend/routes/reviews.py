from flask import request, jsonify
from flask_jwt_extended import jwt_required
from . import reviews_bp
from models import Review, ProductReview, db

@reviews_bp.route('', methods=['GET'])
def get_all_reviews():
    """Получить отзывы с фильтрацией по пользователю"""
    user_id = request.args.get('user_id')
    limit = request.args.get('limit', type=int)
    rating = request.args.get('rating', type=int)
    
    query = Review.query
    
    # Фильтрация по пользователю (полученные отзывы)
    if user_id:
        query = query.filter_by(target_user_id=user_id)
    
    # Фильтрация по рейтингу
    if rating:
        query = query.filter_by(rating=rating)
    
    # Лимит для пагинации
    if limit:
        query = query.limit(limit)
    
    reviews = query.order_by(Review.date.desc()).all()
    
    return jsonify([{
        'id': r.id,
        'rating': r.rating,
        'comment': r.comment,
        'date': r.date.isoformat(),
        'author': r.author.username,
        'target_user_id': r.target_user_id
    } for r in reviews])

@reviews_bp.route('/stats/<int:user_id>', methods=['GET'])
def get_reviews_stats(user_id):
    """Получить статистику отзывов для пользователя"""
    # Полученные отзывы
    received_reviews = Review.query.filter_by(target_user_id=user_id).all()
    
    if not received_reviews:
        return jsonify({
            'average': 0,
            'total_reviews': 0,
            'rating_distribution': [0, 0, 0, 0, 0]
        })
    
    total_reviews = len(received_reviews)
    average_rating = sum(r.rating for r in received_reviews) / total_reviews
    
    # Распределение по рейтингам
    rating_distribution = [0, 0, 0, 0, 0]
    for review in received_reviews:
        if 1 <= review.rating <= 5:
            rating_distribution[review.rating - 1] += 1
    
    return jsonify({
        'average': round(average_rating, 1),
        'total_reviews': total_reviews,
        'rating_distribution': rating_distribution
    })

@reviews_bp.route('/query', methods=['GET'])
def get_reviews_query():
    """Старый эндпоинт для совместимости"""
    reviews = Review.query.all()
    average = sum(r.rating for r in reviews) / len(reviews) if reviews else 0
    return jsonify({
        'average': average,
        'reviews': [{
            'id': r.id,
            'rating': r.rating,
            'comment': r.comment,
            'date': r.date.isoformat(),
            'author': r.author.username
        } for r in reviews]
    })

@reviews_bp.route('/add', methods=['POST'])
@jwt_required()
def add_review():
    data = request.json
    new_review = Review(
        target_user_id=data['target_user_id'],
        author_user_id=data['author_user_id'],
        rating=data['rating'],
        comment=data.get('comment')
    )
    db.session.add(new_review)
    db.session.commit()
    return jsonify({'id': new_review.id}), 201