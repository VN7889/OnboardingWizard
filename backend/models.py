from db import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    about_me = db.Column(db.Text)
    street = db.Column(db.String(120))
    city = db.Column(db.String(80))
    state = db.Column(db.String(80))
    zip = db.Column(db.String(20))
    birthdate = db.Column(db.String(20))

class ComponentConfig(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    page_number = db.Column(db.Integer, nullable=False)
    component_name = db.Column(db.String(120), nullable=False)
