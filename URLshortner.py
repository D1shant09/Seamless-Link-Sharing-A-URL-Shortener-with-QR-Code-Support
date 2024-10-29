# URLshortner.py
from flask import Flask, request, redirect, render_template
from flask_sqlalchemy import SQLAlchemy
import string
import random


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


class URLMap(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    original_url = db.Column(db.String(2048), nullable=False)
    short_url = db.Column(db.String(6), unique=True, nullable=False)


with app.app_context():
    db.create_all()


def generate_short_code(length=6):
    characters = string.ascii_letters + string.digits
    while True:
        short_code = ''.join(random.choices(characters, k=length))
        if not URLMap.query.filter_by(short_url=short_code).first():
            return short_code


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        original_url = request.form.get('url')
        
        
        if not original_url:
            return "Invalid URL", 400

       
        url_entry = URLMap.query.filter_by(original_url=original_url).first()
        if url_entry:
            short_url = url_entry.short_url
        else:
            short_url = generate_short_code()
            new_entry = URLMap(original_url=original_url, short_url=short_url)
            db.session.add(new_entry)
            db.session.commit()

        
        return f"Shortened URL: {request.host_url}{short_url}"

   
    return render_template('index.html')

# Route for redirection
@app.route('/<short_url>')
def redirect_url(short_url):
    url_entry = URLMap.query.filter_by(short_url=short_url).first()
    if url_entry:
        return redirect(url_entry.original_url)
    else:
        return "URL not found", 404


if __name__ == '__main__':
    app.run(debug=True)
