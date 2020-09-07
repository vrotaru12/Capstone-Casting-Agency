from sqlalchemy import Column, String, Integer, Boolean, DateTime, ARRAY, ForeignKey
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os



#database_path = "postgres://USER:PASSWORD@localhost:5432/DBMNAME" to run locally
#to run on Heroku
database_path = "postgres://fnofdvcwumtzcf:61ed989a72681d6c5dd7098af9ef2df78bbcbe51fdf99eccee068ce5cffa2e2e@ec2-23-22-156-110.compute-1.amazonaws.com:5432/d6mv72jfbsls7e"
db = SQLAlchemy()

'''
setup_db(app)
    binds a flask application and a SQLAlchemy service
'''
def setup_db(app, database_path=database_path):
    app.config["SQLALCHEMY_DATABASE_URI"] = database_path
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.app = app
    db.init_app(app)

'''
db_drop_and_create_all()
    drops the database tables and starts fresh
    can be used to initialize a clean database
    !!NOTE you can change the database_filename variable to have multiple verisons of a database
'''
def db_drop_and_create_all():
    db.drop_all()
    db.create_all()

'''
Movie
a persistent movie entity, extends the base SQLAlchemy Model
'''
class Movie(db.Model):
    __tablename__ = 'Movie'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String())
    release_date = db.Column(db.String())
    image = db.Column(db.String)
    description = db.Column(db.String)
    cast = db.relationship('Cast', backref='Movie', lazy='dynamic')

    def __init__(self, title, release_date,description, image):
        self.title = title
        self.release_date = release_date
        self.description = description
        self.image = image


    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()
    
    def delete(self):
        db.session.delete(self)
        db.session.commit()
  
    def short(self):
        return{
            'id':self.id,
            'title':self.title
        }
    
    def long(self):
        return{
            'id' :self.id,
            'title' :self.title,
            'release_date' : self.release_date,
            'image': self.image,
            'description': self.image
        }

'''
Actor
a persistent actor entity, extends the base SQLAlchemy Model
'''       

class Actor(db.Model):
    __tablename__ = 'Actor'
    
    id = Column(Integer, primary_key=True)
    name = db.Column(db.String)
    age = db.Column(db.Integer)
    gender = db.Column(db.String)
    image = db.Column(db.String)
    description = db.Column(db.String)
    cast = db.relationship('Cast', backref='Actor', lazy=True)


    def __init__(self, name, age, gender, image, description):
        self.name = name
        self.age = age
        self.gender = gender
        self.description = description
        self.image = image
    
    def insert(self):
        db.session.add(self)
        db.session.commit()
    
    def update(self):
        db.session.commit()
    
    def delete(self):
        db.session.delete(self)
        db.session.commit()
    
    def short(self):
        return{
            'id': self.id,
            'name':self.name
        }
    
    def details(self):
        return{
            'id': self.id,
            'name': self.name,
            'age': self.age,
            'gender': self.gender,
            'image': self.image,
            'description': self.description
        }

'''
Cast
a persistent cast entity, extends the base SQLAlchemy Model
'''

class Cast(db.Model):

    __tablename__ = 'Cast'
    id = db.Column(Integer,primary_key=True)
    movie_id = db.Column(Integer, ForeignKey(Movie.id), nullable=False)
    actor_id = db.Column(Integer, ForeignKey(Actor.id), nullable=False)



    def __init__(self, movie_id,actor_id):
        self.movie_id = movie_id
        self.actor_id = actor_id

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def detail(self):
        return{
            'movie_id' :self.movie_id,
            'movie_title' :self.Movie.title,
            'movie_image': self.Movie.image,
            'actor_id' :self.actor_id,
            'actor_name' :self.Actor.name,
            'actor_description': self.Actor.description,
            'actor_image': self.Actor.image,
        }


        
  

