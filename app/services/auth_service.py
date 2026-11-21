from datetime import datetime, timedelta, timezone
from functools import wraps
import jwt
from flask import request, jsonify, current_app
from ..models import db, User

def generate_token(user):
    """Generates a secure JWT token for authenticated user"""
    now = datetime.now(timezone.utc)
    payload = {
        'user_id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role,
        'exp': now + timedelta(hours=current_app.config.get('JWT_ACCESS_TOKEN_EXPIRES_HOURS', 24)),
        'iat': now
    }
    secret = current_app.config['JWT_SECRET_KEY']
    return jwt.encode(payload, secret, algorithm='HS256')

def decode_token(token):
    """Decodes and validates JWT token"""
    try:
        secret = current_app.config['JWT_SECRET_KEY']
        payload = jwt.decode(token, secret, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return {'error': 'Session expired. Please log in again.'}
    except jwt.InvalidTokenError:
        return {'error': 'Invalid authentication token.'}

def get_current_user_from_header():
    """Extracts bearer token and returns user if valid"""
    auth_header = request.headers.get('Authorization', None)
    if not auth_header:
        return None
    parts = auth_header.split()
    if len(parts) != 2 or parts[0].lower() != 'bearer':
        return None
    token = parts[1]
    payload = decode_token(token)
    if 'error' in payload:
        return None
    return db.session.get(User, payload.get('user_id'))

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        user = get_current_user_from_header()
        if not user:
            return jsonify({
                'success': False,
                'message': 'Authentication required. Please log in.'
            }), 401
        return f(user, *args, **kwargs)
    return decorated

def optional_token(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        user = get_current_user_from_header()
        return f(user, *args, **kwargs)
    return decorated

def roles_required(allowed_roles):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            user = get_current_user_from_header()
            if not user:
                return jsonify({
                    'success': False,
                    'message': 'Authentication required.'
                }), 401
            if user.role not in allowed_roles:
                return jsonify({
                    'success': False,
                    'message': f'Access denied. Required role: {", ".join(allowed_roles)}'
                }), 403
            return f(user, *args, **kwargs)
        return decorated
    return decorator
