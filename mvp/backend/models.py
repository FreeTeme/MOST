from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

# Association tables
social_niche = db.Table('social_niche',
    db.Column('social_id', db.Integer, db.ForeignKey('social.id'), primary_key=True),
    db.Column('niche_id', db.Integer, db.ForeignKey('niche.id'), primary_key=True)
)

product_niche = db.Table('product_niche',
    db.Column('product_id', db.Integer, db.ForeignKey('product.id'), primary_key=True),
    db.Column('niche_id', db.Integer, db.ForeignKey('niche.id'), primary_key=True)
)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    views = db.Column(db.Integer, default=0)
    telegram_id = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    socials = db.relationship('Social', backref='user', lazy=True)
    reviews_given = db.relationship('Review', foreign_keys='Review.author_user_id', backref='author', lazy=True)
    reviews_received = db.relationship('Review', foreign_keys='Review.target_user_id', backref='target', lazy=True)
    product_reviews = db.relationship('ProductReview', backref='author', lazy=True)
    products = db.relationship('Product', backref='advertiser', lazy=True)
    applications = db.relationship('BloggerApplication', backref='blogger', lazy=True)

class Niche(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

class Social(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    platform = db.Column(db.String(50), nullable=False)
    followers = db.Column(db.Integer, nullable=False)
    region = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    link = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    niches = db.relationship('Niche', secondary=social_niche, backref=db.backref('socials', lazy=True))
    metrics = db.relationship('Metrics', backref='social', lazy=True)

class Metrics(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    social_id = db.Column(db.Integer, db.ForeignKey('social.id'), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    likes = db.Column(db.Integer, default=0)
    comments = db.Column(db.Integer, default=0)
    er = db.Column(db.Float, default=0.0)
    growth_rate = db.Column(db.Float, default=0.0)

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    target_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    author_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text)
    date = db.Column(db.DateTime, default=datetime.utcnow)

class ProductReview(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    author_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    rating = db.Column(db.Integer)
    comment = db.Column(db.Text)
    date = db.Column(db.DateTime, default=datetime.utcnow)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    advertiser_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    brand = db.Column(db.String(100))
    budget = db.Column(db.Integer, nullable=False)
    deadline = db.Column(db.Date)
    status = db.Column(db.String(20), default='not_started')
    description = db.Column(db.Text)
    payment_type = db.Column(db.String(20), default='money')
    image_url = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    niches = db.relationship('Niche', secondary=product_niche, backref=db.backref('products', lazy=True))
    applications = db.relationship('BloggerApplication', backref='product', lazy=True)
    reviews = db.relationship('ProductReview', backref='product', lazy=True)

class BloggerApplication(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    blogger_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    status = db.Column(db.String(20), default='pending')
    applied_at = db.Column(db.DateTime, default=datetime.utcnow)