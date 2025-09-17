from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# Настройка CORS для фронтенда на localhost:3000
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Модели (без изменений)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    views = db.Column(db.Integer, default=0)

class Social(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    platform = db.Column(db.String(50), nullable=False)
    followers = db.Column(db.Integer, nullable=False)
    region = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    link = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    target_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    author_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text)
    date = db.Column(db.DateTime, default=datetime.utcnow)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    advertiser_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    brand = db.Column(db.String(100))
    budget = db.Column(db.String(50), nullable=False)
    category = db.Column(db.String(50))
    deadline = db.Column(db.Date)
    status = db.Column(db.String(20), default='pending')
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class BloggerApplication(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    blogger_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    status = db.Column(db.String(20), default='pending')
    applied_at = db.Column(db.DateTime, default=datetime.utcnow)

# Эндпоинт для регистрации
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'blogger')
    if not username or not email or not password:
        return jsonify({'error': 'Missing required fields'}), 400
    if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
        return jsonify({'error': 'Username or email already exists'}), 400
    new_user = User(
        username=username,
        email=email,
        password_hash=generate_password_hash(password),
        role=role
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'userId': new_user.id, 'message': 'User registered successfully'}), 201

# Эндпоинт для авторизации
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password_hash, password):
        return jsonify({'userId': user.id, 'role': user.role, 'message': 'Login successful'}), 200
    return jsonify({'error': 'Invalid credentials'}), 401

# Остальные эндпоинты (без изменений, для контекста)
@app.route('/api/socials', methods=['GET', 'POST'])
def handle_socials():
    user_id = request.headers.get('User-ID')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    if request.method == 'GET':
        limit = request.args.get('limit', None, type=int)
        query = Social.query.filter_by(user_id=user_id).order_by(Social.created_at.desc())
        if limit:
            query = query.limit(limit)
        socials = query.all()
        return jsonify([{
            'id': s.id,
            'platform': s.platform,
            'followers': s.followers,
            'region': s.region,
            'price': s.price,
            'category': s.category,
            'link': s.link,
            'created_at': s.created_at.isoformat()
        } for s in socials])

    elif request.method == 'POST':
        data = request.json
        new_social = Social(
            user_id=user_id,
            platform=data['platform'],
            followers=data['followers'],
            region=data['region'],
            price=data['price'],
            category=data['category'],
            link=data['link']
        )
        db.session.add(new_social)
        db.session.commit()
        return jsonify({'id': new_social.id, 'message': 'Social added successfully'}), 201

@app.route('/api/socials/<int:social_id>', methods=['PUT', 'DELETE'])
def manage_social(social_id):
    user_id = request.headers.get('User-ID')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    social = Social.query.filter_by(id=social_id, user_id=user_id).first()
    if not social:
        return jsonify({'error': 'Not found'}), 404

    if request.method == 'PUT':
        data = request.json
        social.platform = data.get('platform', social.platform)
        social.followers = data.get('followers', social.followers)
        social.region = data.get('region', social.region)
        social.price = data.get('price', social.price)
        social.category = data.get('category', social.category)
        social.link = data.get('link', social.link)
        db.session.commit()
        return jsonify({
            'id': social.id,
            'platform': social.platform,
            'followers': social.followers,
            'region': social.region,
            'price': social.price,
            'category': social.category,
            'link': social.link,
            'message': 'Social updated successfully'
        })

    elif request.method == 'DELETE':
        db.session.delete(social)
        db.session.commit()
        return jsonify({'message': 'Social deleted successfully'})

# ... (остальные эндпоинты из предыдущего ответа без изменений)

if __name__ == '__main__':
    if not os.path.exists('database.db'):
        with app.app_context():
            db.create_all()
            # Добавление тестового пользователя
            if not User.query.filter_by(username='testuser').first():
                user = User(
                    username='testuser',
                    email='test@example.com',
                    password_hash=generate_password_hash('password'),
                    role='blogger'
                )
                db.session.add(user)
                db.session.commit()
                social = Social(
                    user_id=user.id,
                    platform='Instagram',
                    followers=10000,
                    region='Москва',
                    price=5000,
                    category='Красота',
                    link='https://instagram.com/test'
                )
                db.session.add(social)
                db.session.commit()
    app.run(debug=True)