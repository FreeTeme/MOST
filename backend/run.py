from flask import Flask
from flask_cors import CORS
from models import db
from routes.products import products_bp
from routes.applications import applications_bp
from routes.reviews import reviews_bp
from routes.socials import socials_bp

def create_app():
    app = Flask(__name__)
    
    # Конфигурация
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Инициализация расширений
    db.init_app(app)
    CORS(app)
    
    app.register_blueprint(products_bp, url_prefix="/api/products")
    app.register_blueprint(applications_bp, url_prefix="/api/applications")
    app.register_blueprint(reviews_bp, url_prefix="/api/reviews")
    app.register_blueprint(socials_bp, url_prefix="/api/socials")
    
    return app

if __name__ == '__main__':
    app = create_app()
    
    with app.app_context():
        db.create_all()
        
        # Добавляем базовые данные
        from models import User, Niche, Product, Social
        from datetime import datetime, timedelta
        
        # Проверяем, есть ли уже пользователи
        if not User.query.first():
            # Создаем тестовых пользователей
            test_users = [
                User(username='blogger1', email='blogger1@test.com', password_hash='123', role='blogger'),
                User(username='advertiser1', email='advertiser1@test.com', password_hash='123', role='advertiser'),
                User(username='admin1', email='admin1@test.com', password_hash='123', role='admin')
            ]
            
            for user in test_users:
                db.session.add(user)
            
            # Создаем базовые ниши
            basic_niches = ['красота', 'мода', 'здоровье', 'спорт', 'еда', 'техника', 'путешествия']
            for niche_name in basic_niches:
                niche = Niche(name=niche_name)
                db.session.add(niche)
            
            db.session.commit()
            print("Test users and niches added successfully!")
        
        # Проверяем, есть ли уже продукты
        if not Product.query.first():
            # Получаем advertiser1
            advertiser = User.query.filter_by(username='advertiser1').first()
            # Получаем ниши
            beauty_niche = Niche.query.filter_by(name='красота').first()
            fashion_niche = Niche.query.filter_by(name='мода').first()
            tech_niche = Niche.query.filter_by(name='техника').first()

            # Создаем тестовые продукты
            products = [
                Product(
                    advertiser_id=advertiser.id,
                    name='Рекламная кампания косметики',
                    brand='Luxury Cosmetics',
                    budget=50000,
                    deadline=datetime.utcnow() + timedelta(days=30),
                    description='Продвижение новой линии люксовой косметики',
                    category='Красота',
                    status='active'
                ),
                Product(
                    advertiser_id=advertiser.id,
                    name='Коллаборация с модным блогером',
                    brand='Fashion Brand',
                    budget=30000,
                    deadline=datetime.utcnow() + timedelta(days=45),
                    description='Создание контента для новой коллекции одежды',
                    category='Мода',
                    status='active'
                ),
                Product(
                    advertiser_id=advertiser.id,
                    name='Обзор гаджетов',
                    brand='TechCorp',
                    budget=75000,
                    deadline=datetime.utcnow() + timedelta(days=60),
                    description='Обзоры новых смартфонов и ноутбуков',
                    category='Техника',
                    status='active'
                )
            ]
            
            products[0].niches.append(beauty_niche)
            products[1].niches.append(fashion_niche)
            products[2].niches.append(tech_niche)
            
            for product in products:
                db.session.add(product)
            
            db.session.commit()
            print("Test products added!")
        
        # Проверяем, есть ли социальные сети у блогера
        if not Social.query.first():
            blogger = User.query.filter_by(username='blogger1').first()
            beauty_niche = Niche.query.filter_by(name='красота').first()
            fashion_niche = Niche.query.filter_by(name='мода').first()
            
            socials = [
                Social(
                    user_id=blogger.id,
                    platform='Instagram',
                    followers=15000,
                    region='Беларусь',
                    price=5000,
                    link='https://instagram.com/blogger1'
                ),
                Social(
                    user_id=blogger.id,
                    platform='YouTube',
                    followers=25000,
                    region='СНГ',
                    price=15000,
                    link='https://youtube.com/blogger1'
                )
            ]
            
            socials[0].niches.append(beauty_niche)
            socials[0].niches.append(fashion_niche)
            socials[1].niches.append(beauty_niche)
            
            for social in socials:
                db.session.add(social)
            
            db.session.commit()
            print("Test socials added!")
    
    app.run(debug=True, port=5000)