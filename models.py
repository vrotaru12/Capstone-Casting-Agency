from sqlalchemy import Column, String, Integer, Boolean, DateTime, ARRAY, ForeignKey
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os



database_path = "postgres://postgres:pasolvon12@localhost:5432/moviecast"
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
    cast = db.relationship('Cast', backref='Movie', lazy='dynamic')

    def __init__(self, title, release_date):
        self.title = title
        self.release_date = release_date

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
            'release_date' : self.release_date
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
    cast = db.relationship('Cast', backref='Actor', lazy=True)


    def __init__(self, name, age, gender):
        self.name = name
        self.age = age
        self.gender = gender
    
    def insert(self):
        db.session.add(self)
        db.session.commit()
    
    def update(self):
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
            'gender': self.gender

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
            'actor_id' :self.actor_id,
            'actor_name' :self.Actor.name
        }

    # def actor_details(self):
    #     return{
    #         'artist_id' :self.venue_id,
    #         'artist_name' :self.Artist.name,
    #         'artist_image_link' :self.Artist.image_link,
    #         'start_time' :self.start_time

    #     }
 
    
    # def movie_details(self):
    #     return{
    #         'movie_id' :self.movie_id,
    #         'movie_title' :self.Movie.title,
    #         'venue_image_link' :self.Venue.image_link,
    #         'start_time' :self.start_time
            
    #     }

        
  

