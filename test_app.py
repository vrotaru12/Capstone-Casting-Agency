import os
import unittest
import json
from flask_sqlalchemy import SQLAlchemy

from app import create_app
from models import setup_db, Actor, Movie

assistant_token = os.getenv('ASSISTANT_TOKEN')
director_token = os.getenv('DIRECTOR_TOKEN')
producer_token = os.getenv('PRODUCER_TOKEN')


def set_auth_header(role):
    if role == 'assistant':
        return {'Authorization': 'Bearer {}'.format(assistant_token)}
    elif role == 'director':
        return {'Authorization': 'Bearer {}'.format(director_token)}
    elif role == 'producer':
        return {'Authorization': 'Bearer {}'.format(producer_token)}

class CastingAgencyTestCase(unittest.TestCase):
  """This class represents the Casting Agency test case"""

  def setUp(self):
    """Define test variables and initialize app."""
    self.app = create_app()
    self.client = self.app.test_client
    self.database_name = "moviecast"
    self.database_path = "postgres://{}:{}@{}/{}".format('postgres','pasolvon12', 'localhost:5432', self.database_name)
    setup_db(self.app, self.database_path)

    
    # binds the app to the current context
    with self.app.app_context():
      self.db = SQLAlchemy()
      self.db.init_app(self.app)
      # create all tables
      #self.db.create_all()

  def tearDown(self):
    """Executed after reach test"""
    pass

  #  Success behavior tests
  #  ----------------------------------------------------------------
  def test_get_actors (self):
    res = self.client().get('/actors', headers=set_auth_header('assistant'))
    data = json.loads(res.data)

    self.assertEqual(res.status_code, 200)
    self.assertTrue(data['success'])
    self.assertTrue(len(data['actors']) >= 0)
  
  def test_get_actors (self):
    res = self.client().get('/movies', headers=set_auth_header('producer'))
    data = json.loads(res.data)

    self.assertEqual(res.status_code, 200)
    self.assertTrue(data['success'])
    self.assertTrue(len(data['movies']) >= 0)

  def test_get_actor_details(self):
    res = self.client().get('/actors-detail',headers=set_auth_header('assistant'))
    data = json.loads(res.data)

    self.assertEqual(res.status_code, 200)
    self.assertEqual(data["success"], True)
    self.assertTrue(len(data["actors"]))
    

  def test_delete_movie(self):
    movie = Movie(title='Test title', release_date="09-10-20")
    movie.insert()
    movie_id = movie.id

    res = self.client().delete(f'/movies/{movie_id}', headers=set_auth_header('producer'))
    data = json.loads(res.data)

    movie = Movie.query.filter(
    Movie.id == movie.id).one_or_none()

    self.assertEqual(res.status_code, 200)
    self.assertEqual(data['success'], True)
    self.assertEqual(data['delete'], movie_id)
    self.assertEqual(movie, None)
    
  def test_422_delete_actor(self):
    res = self.client().delete('/actors/1111111', headers=set_auth_header('director'))
    data = json.loads(res.data)

    self.assertEqual(res.status_code, 422)
    self.assertEqual(data["success"], False)
    self.assertEqual(data["message"], "unprocessable")

  def test_delete_actor(self):
    actor = Actor(name='Test Actor title', age="20", gender="M")
    actor.insert()
    actor_id = actor.id

    res = self.client().delete(f'/actors/{actor_id}', headers=set_auth_header('producer'))
    data = json.loads(res.data)

    actor = Actor.query.filter(
    Actor.id == actor.id).one_or_none()

    self.assertEqual(res.status_code, 200)
    self.assertEqual(data['success'], True)
    self.assertEqual(data['delete'], actor_id)
    self.assertEqual(actor, None)
    
  def test_422_delete_movie(self):
    res = self.client().delete('/movies/1111111', headers=set_auth_header('director'))
    data = json.loads(res.data)

    self.assertEqual(res.status_code, 422)
    self.assertEqual(data["success"], False)
    self.assertEqual(data["message"], "unprocessable")
    

  def test_add_new_actor(self):
    post_data = {
      'name': 'Test',
      'age': '10',
      'gender': "Test"
    }
    res = self.client().post('/actors',headers=set_auth_header('director'), json=post_data)
    data = json.loads(res.data)

    self.assertEqual(res.status_code, 200)
    self.assertEqual(data["success"], True)
    self.assertTrue(len(data["actors"]))

  def test_add_new_movie(self):
    post_data = {
      'title': 'Test Movie',
      'release_date': '10-10-2018'
    }
    res = self.client().post('/movies',headers=set_auth_header('producer'), json=post_data)
    data = json.loads(res.data)

    self.assertEqual(res.status_code, 200)
    self.assertEqual(data["success"], True)
    self.assertTrue(len(data["movies"]))

  
  def test_update_actors(self):
    res = self.client().patch('/actors/2',json={'name': 'test patch'}, headers=set_auth_header('director'))
    data = json.loads(res.data)
    actor = Actor.query.filter(Actor.id == 2).one_or_none()

    self.assertEqual(res.status_code, 200)
    self.assertEqual(data['success'], True)
  

  def test_update_movies(self):
    res = self.client().patch('/movies/1',json={'title': 'test patch'}, headers=set_auth_header('director'))
    data = json.loads(res.data)
    actor = Movie.query.filter(Movie.id == 1).one_or_none()

    self.assertEqual(res.status_code, 200)
    self.assertEqual(data['success'], True)

  def test_422_delete_actor(self):
    res = self.client().delete('/actors/1111111', headers=set_auth_header('director'))
    data = json.loads(res.data)

    self.assertEqual(res.status_code, 422)
    self.assertEqual(data["success"], False)
    self.assertEqual(data["message"], "unprocessable")
  
  def test_401_post_actor_no_autorization(self):
    post_data = {
      'name': 'Test No Auth',
      'age': 'No AUTH',
      'gender': "Test No Auth"
    }
    res = self.client().post('/actors',json=post_data, headers=set_auth_header('assistant'))
    data = json.loads(res.data)

    self.assertEqual(res.status_code, 401)
    self.assertEqual(data["success"], False)
    self.assertEqual(data["message"], "Unauthorized")

  def test_401_patch_movie_no_autorization(self):
    res = self.client().patch('/movies/1',json={'title': 'test patch'}, headers=set_auth_header('assistant'))
    data = json.loads(res.data)

    self.assertEqual(res.status_code, 401)
    self.assertEqual(data["success"], False)
    self.assertEqual(data["message"], "Unauthorized")

if __name__ == '__main__':
    unittest.main()