import os
import unittest
import json
from flask_sqlalchemy import SQLAlchemy

from app import create_app
from models import setup_db, Actor, Movie

# assistant_token = os.getenv('ASSISTANT_TOKEN')
# director_token = os.getenv('DIRECTOR_TOKEN')
# producer_token = os.getenv('PRODUCER_TOKEN')
assistant_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjJ6ZWI1eGIwaVZNbExXZExQQVd5ZyJ9.eyJpc3MiOiJodHRwczovL3ZyZGV2LmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw1ZjAzNmU4ZDZiMjU2MTAwMTkxMWE2YTIiLCJhdWQiOiJNb3ZpZUNhc3RBcHAiLCJpYXQiOjE1OTU1MjA4NjQsImV4cCI6MTU5NTYwNzI2NCwiYXpwIjoibnVmRXNFVE8yVzQzQm80MkFpN1l6TmRzcDd3b1dibVAiLCJzY29wZSI6IiIsInBlcm1pc3Npb25zIjpbImdldDphY3RvciIsImdldDphY3Rvci1kZXRhaWwiLCJnZXQ6bW92aWUiXX0.Q885VXzL2sS0FJujJqoXP_Ihg9f7BugI4uS6y5tytn5W9N0Ci05ZuaHb0086tk6SJeC3l1CI4AL0bKPgk_o2oYvFR6cI91ysMYW-yhoHb-tjoI0dYekeRioAx6uHw31ciKizGDWvcKwnKZl28UWYCUrvmBh-DTsE1NYxPfG5Tw_9RJ6nCd5N5Yn5t2hpah9WvaYTpnvWdOEGYo_SwhtaxhxYT010c1zWdvGmhj52PiGa9xa3Az26V9h1hG44JlSkStcewnp62fDtdp8RHONfSUMm-iKNMbi5zftZvY2Gd1FCd_2nxKc1IlyqJtEyOfyyuxy_1xD4RExQlEJlJmwFQg"
director_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjJ6ZWI1eGIwaVZNbExXZExQQVd5ZyJ9.eyJpc3MiOiJodHRwczovL3ZyZGV2LmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw1ZWU0Y2U2ZGNhNmY0ODAwMTk5NDc4YTEiLCJhdWQiOiJNb3ZpZUNhc3RBcHAiLCJpYXQiOjE1OTU1MjEwMzIsImV4cCI6MTU5NTYwNzQzMiwiYXpwIjoibnVmRXNFVE8yVzQzQm80MkFpN1l6TmRzcDd3b1dibVAiLCJzY29wZSI6IiIsInBlcm1pc3Npb25zIjpbImRlbGV0ZTphY3RvciIsImRlbGV0ZTptb3ZpZSIsImdldDphY3RvciIsImdldDphY3Rvci1kZXRhaWwiLCJnZXQ6bW92aWUiLCJwYXRjaDphY3RvciIsInBhdGNoOm1vdmllIiwicG9zdDphY3RvciIsInBvc3Q6bW92aWUiXX0.HP1LBRm_D0z_2v6MNlNT2zbXxBB55aPmRdYlSyUujVAXlJeTeSztNXTGV-1BDJymDT6BGec44dMmWDdbo7DDvLGZT04aRiaaaQLlnldiqbqY32cFZUy-vpDL2eQSUgpQepiYWMpiYc_CZJPNSgdrZ74YFXDy2aAIBvEeN4jea2s8GqJ6yga7IIaPdPF5UmRKQfu20LZftC52TI1yATuUwJHsQpkLpHXdAxA8Atcf02pKNg8_ezqluCnuNrGiYXgROWG5ULtWsSmqspDVYeU4bnAPoQKj2atfp-dOn_fODmU3uJgyWKemgnDi9TlZ7wplN7ccFpyOq8CEoxWk1kmoDQ"
producer_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjJ6ZWI1eGIwaVZNbExXZExQQVd5ZyJ9.eyJpc3MiOiJodHRwczovL3ZyZGV2LmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw1ZWU0Y2VjYWI4YTY1OTAwMTllMWRjNTkiLCJhdWQiOiJNb3ZpZUNhc3RBcHAiLCJpYXQiOjE1OTU1MjA5ODIsImV4cCI6MTU5NTYwNzM4MiwiYXpwIjoibnVmRXNFVE8yVzQzQm80MkFpN1l6TmRzcDd3b1dibVAiLCJzY29wZSI6IiIsInBlcm1pc3Npb25zIjpbImRlbGV0ZTphY3RvciIsImRlbGV0ZTptb3ZpZSIsImdldDphY3RvciIsImdldDphY3Rvci1kZXRhaWwiLCJnZXQ6bW92aWUiLCJwb3N0OmFjdG9yIiwicG9zdDptb3ZpZSJdfQ.EQHRr5AHHNsjMLdFIy5A-iIrg2BZKzZWoXSEsIpMuC4I7NUenbvMoy4kOw1Kg4tHx23gzR1B73KOTH_EM8NlXCOhogtg0LBnXO5qzLHxMpXzDPYVZwvwlC8sD59yHDlyAhQzNW-QHpxzmn7DMIDYbEtX9TggZLM0p7BI3hYQthD7RtINbnb1VDaEO37iUw9s1H0v16L8k94S29In6ie9WcHVDA-bnsJNSx39S12iEv7ZFXnSeb41kC0YzEROSgfgdrDxPUUuHY4pQTj4mPGMlf0azZ2iCm4I7xJxmh9TLGjpV2zn3QOgv8hJKy94GWhBycMoNPjE17EEnO7RNlHgsQ"
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
