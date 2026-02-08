from flask import Blueprint

socials_bp = Blueprint('socials', __name__)
products_bp = Blueprint('products', __name__)
reviews_bp = Blueprint('reviews', __name__)
applications_bp = Blueprint('applications', __name__)
admin_bp = Blueprint('admin', __name__)
profile_bp = Blueprint('profile', __name__)
auth_bp = Blueprint('auth', __name__)

from . import socials, products, reviews, applications, admin, profile, auth