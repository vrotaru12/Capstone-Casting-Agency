import os
import unittest
import json
from flask_sqlalchemy import SQLAlchemy

from app import create_app
from models import setup_db, Actor, Movie

# assistant_token = os.getenv('ASSISTANT_TOKEN')
# director_token = os.getenv('DIRECTOR_TOKEN')
# producer_token = os.getenv('PRODUCER_TOKEN')
assistant_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjJ6ZWI1eGIwaVZNbExXZExQQVd5ZyJ9.eyJpc3MiOiJodHRwczovL3ZyZGV2LmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw1ZjAzNmU4ZDZiMjU2MTAwMTkxMWE2YTIiLCJhdWQiOiJNb3ZpZUNhc3RBcHAiLCJpYXQiOjE1OTU0MDE5MzQsImV4cCI6MTU5NTQ4ODMzNCwiYXpwIjoibnVmRXNFVE8yVzQzQm80MkFpN1l6TmRzcDd3b1dibVAiLCJzY29wZSI6IiIsInBlcm1pc3Npb25zIjpbImdldDphY3RvciIsImdldDphY3Rvci1kZXRhaWwiLCJnZXQ6bW92aWUiXX0.V_9Bon1McCE2KqWD9Qm-uezIeQrdaMkzVAZf3MHmU0bjwWdMifiZxrTcRxMmFVokr1P4is5IPltvw8Q2iOt1JqhdWwqQAny8OWuuMAIM_pSoBoql8xE-vhobNaJtnOTy4d8DdSHso4LQi50hM9DNnL0sGgl_w0GC__Vv3NpRfimAok_vXf3FxyrnYKTWthdSaf2gyoeN2nGLL9U789kNrMFpCIfJb1WNbU2XBS5UEGtr87fW_q5mygKJc9tJQaaxmRo51rhAxWc3yldN8vypcvgR6kAfo0VEQl7h6DICKDfxnvS0RzHRlJGjRPdr1zl90AX6F_0kH12kdlgi39tXYQ"
director_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjJ6ZWI1eGIwaVZNbExXZExQQVd5ZyJ9.eyJpc3MiOiJodHRwczovL3ZyZGV2LmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw1ZWU0Y2U2ZGNhNmY0ODAwMTk5NDc4YTEiLCJhdWQiOiJNb3ZpZUNhc3RBcHAiLCJpYXQiOjE1OTU0MDE0MjQsImV4cCI6MTU5NTQ4NzgyNCwiYXpwIjoibnVmRXNFVE8yVzQzQm80MkFpN1l6TmRzcDd3b1dibVAiLCJzY29wZSI6IiIsInBlcm1pc3Npb25zIjpbImRlbGV0ZTphY3RvciIsImRlbGV0ZTptb3ZpZSIsImdldDphY3RvciIsImdldDphY3Rvci1kZXRhaWwiLCJnZXQ6bW92aWUiLCJwYXRjaDphY3RvciIsInBhdGNoOm1vdmllIiwicG9zdDphY3RvciIsInBvc3Q6bW92aWUiXX0.kdnNdkcVuq-iL3sA3h53PbcggmK9ymYH6wa6U7ehIek4NFz2UlNDJk_BqKrn5CXNwHAM0VxhuJQggPDj6z4WY6Fp5GWuQF4wLfbm8K7b3jSpekTZo8axOOm_nB5WCwoK4pNSMZ_a0ACpyKq3LhfNW-HGFHly0LyALAz_LS-LvBzMJIXNDQkcdbccsLUzdAxIPFmk3zqrjPdUnsOp9QApQYUygQtmzwR8Nu9M_-70J3j0XlsWIno-eJAUNjoGKkzbnrF31PYLcUC-rx4rptAWi5hznfSWiOC-XsWYtv7B2fh-JaAq1gX5BA10hh_EMpiN4gOFHSLmvn9CqK3fvQzlig"
producer_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjJ6ZWI1eGIwaVZNbExXZExQQVd5ZyJ9.eyJpc3MiOiJodHRwczovL3ZyZGV2LmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw1ZWU0Y2VjYWI4YTY1OTAwMTllMWRjNTkiLCJhdWQiOiJNb3ZpZUNhc3RBcHAiLCJpYXQiOjE1OTU0MDIxNjcsImV4cCI6MTU5NTQ4ODU2NywiYXpwIjoibnVmRXNFVE8yVzQzQm80MkFpN1l6TmRzcDd3b1dibVAiLCJzY29wZSI6IiIsInBlcm1pc3Npb25zIjpbImRlbGV0ZTphY3RvciIsImRlbGV0ZTptb3ZpZSIsImdldDphY3RvciIsImdldDphY3Rvci1kZXRhaWwiLCJnZXQ6bW92aWUiLCJwb3N0OmFjdG9yIiwicG9zdDptb3ZpZSJdfQ.rdKxF1WRhOdFLTBj4Zv0FXJUmIvfIMl08YPmrmoJ9yWXrjZwtz32kNQmQunxIagzGIitbmV252IohBLOKwoUdyYT30DLKBxfeOnLu4sidVvpbnxy_On28fmE0UcQWRiIWDiuI0eSfBXhZAtNhXC1fWKeU-_xicoGAzVU6eqq67W02WogcHzc13oqD77uz-OAJeTl0Lm-6VO1iLnxUCo69m9nSvtxnIosl2gNa0Aa-9VcEapjOf5w0HHgeLDQAwlI1Saava8ggakfh0yDQfoZi21mN8nPygDpONcoCNxE7wyQ3SdIkW5gBscUofEOI2eo_QWok0M-7PeOTj_QSoazYQ"

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
