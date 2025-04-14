from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash
from config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS
from db import db
from models import User, ComponentConfig

def create_app():
    app = Flask(__name__)
    CORS(app)

    # App config
    app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS

    db.init_app(app)

    with app.app_context():
        db.create_all()

        # Set default component configs if none exist
        if not ComponentConfig.query.first():
            default_components = [
                ComponentConfig(page_number=2, component_name='about_me'),
                ComponentConfig(page_number=3, component_name='address'),
            ]
            db.session.add_all(default_components)
            db.session.commit()

    return app

app = create_app()

@app.route('/submit-step', methods=['POST'])
def submit_step():
    data = request.json
    email = data.get('email')
    user = User.query.filter_by(email=email).first()

    if not user:
        user = User(email=email, password=generate_password_hash(data.get('password')))
    
    for field in ['about_me', 'street', 'city', 'state', 'zip', 'birthdate']:
        if field in data:
            setattr(user, field, data[field])

    db.session.add(user)
    db.session.commit()
    return jsonify({'status': 'success'}), 200

@app.route('/admin/config', methods=['GET', 'POST'])
def config():
    if request.method == 'GET':
        configs = ComponentConfig.query.all()
        return jsonify([{'page': c.page_number, 'component': c.component_name} for c in configs])
    
    data = request.json
    ComponentConfig.query.delete()
    for page, components in data.items():
        for comp in components:
            db.session.add(ComponentConfig(page_number=int(page), component_name=comp))
    db.session.commit()
    return jsonify({'status': 'config updated'}), 200

@app.route('/data', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([
        {
            'email': u.email, 'about_me': u.about_me,
            'street': u.street, 'city': u.city, 'state': u.state,
            'zip': u.zip, 'birthdate': u.birthdate
        } for u in users
    ])

if __name__ == '__main__':
    app.run(debug=True)
