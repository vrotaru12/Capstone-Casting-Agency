import json
from flask import Flask, render_template, request, Response, flash, redirect, url_for, jsonify,abort
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import Form
from models import  Movie, Cast, Actor, db_drop_and_create_all, setup_db
from auth.auth import AuthError, requires_auth
from flask_cors import CORS



def create_app(test_config=None):
  # create and configure the app
  app = Flask(__name__)
  setup_db(app)
  CORS(app)

#   return app

# APP = create_app()


  @app.after_request
  def after_request(response):
    response.headers.add(
      'Access-Control-Allow-Headers',
      'Content-Type,Authorization,true')
    response.headers.add(
      'Access-Control-Allow-Methods',
      'GET,PATCH,POST,DELETE,OPTIONS')
    return response


  '''
  !! NOTE THIS WILL DROP ALL RECORDS AND START YOUR DB FROM SCRATCH
  !! NOTE THIS MUST BE UNCOMMENTED ON FIRST RUN
  '''

  #db_drop_and_create_all()

  @app.route('/')
  def main_page():
    return render_template('index.html')


  '''
  @HERE implementing endpoint
    GET /actors
  '''
  @app.route('/actors')
  @requires_auth('get:actor')
  def get_actors(payload):
    actors = Actor.query.all()

    if len(actors) == 0:
      abort(404)

    data = [actor.short() for actor in actors]
    return render_template('pages/actors.html', actors=data)


  '''
  @HERE implementing endpoint
    GET /actors-detail
  '''
  @app.route('/actors-detail')
  @requires_auth('get:actor-detail')
  def get_actors_detail(payload):
    actors = Actor.query.all()

    if len(actors) == 0:
      abort(404)

    return jsonify({
      'success': True,
      'actors': [actor.details() for actor in actors]
    }), 200

  '''
  @HERE implementing endpoint
    GET /movies
  '''
  @app.route('/movies')
  @requires_auth('get:movie')
  def get_movies(payload):
    movies = Movie.query.all()

    if len(movies) == 0:
      abort(404)

    return jsonify({
      'success': True,
      'movies': [movie.short() for movie in movies]
    }), 200



  # '''
  # @HERE implementing endpoint
  #     POST /actors
  # '''
  @app.route('/actors', methods=['POST'])
  @requires_auth('post:actor')
  def add_actors(payload):
    body = request.get_json()

    newname = body['name']
    newage = body['age']
    newgender = body['gender']

    try:
      new_actor = Actor(name=newname,age=newage, gender=newgender)
      new_actor.insert()
      return jsonify({'success': True, 'actors': [new_actor.short()]})

    except BaseException:
      abort(422)

  # '''
  # @HERE implementing endpoint
  #     POST /movies
  # '''
  @app.route('/movies', methods=['POST'])
  @requires_auth('post:movie')
  def add_movies(payload):
    body = request.get_json()

    newtitle = body['title']
    newdate = body['release_date']

    try:
      new_movie = Movie(title=newtitle,release_date=newdate)
      new_movie.insert()
      return jsonify({'success': True, 'movies': [new_movie.short()]})

    except BaseException:
      abort(422)


  '''
  @HERE implementing endpoint
    PATCH /actors/<id>
  '''
  @app.route('/actors/<int:actor_id>', methods=['PATCH'])
  @requires_auth('patch:actor')
  def modify_actors(payload, actor_id):
    body = request.get_json()
    try:
      actor = Actor.query.filter(Actor.id == actor_id).one_or_none()
      if actor is None:
        abort(404)

      if 'name' in body:
        actor.name = body.get('name')
      if 'age' in body:
        actor.age = body.get('age')
      if 'gender' in body:
        actor.gender = body.get('gender')

      actor.update()

      return jsonify({
        'success': True,
        'actors': [actor.details()]
      }), 200
    except BaseException:
      abort(422)


  '''
  @HERE implementing endpoint
    PATCH /movies/<id>
  '''
  @app.route('/movies/<int:movie_id>', methods=['PATCH'])
  @requires_auth('patch:movie')
  def modify_movies(payload, movie_id):
    body = request.get_json()
    try:
      movie = Movie.query.filter(Movie.id == movie_id).one_or_none()
      if movie is None:
        abort(404)

      if 'title' in body:
        movie.title = body.get('title')
      if 'release_date' in body:
        movie.release_date = body.get('release_date')

      movie.update()

      return jsonify({
        'success': True,
        'movies': [movie.short()]
      }), 200
    except BaseException:
      abort(422)



  '''
  @HERE implementing endpoint
    DELETE /actors/<id>
  '''
  @app.route('/actors/<int:actor_id>', methods=['DELETE'])
  @requires_auth('delete:actor')
  def delete_actors(payload, actor_id):
    try:
      actor = Actor.query.filter(Actor.id == actor_id).one_or_none()

      if actor is None:
        abort(404)

      actor.delete()

      return jsonify({
        'success': True,
        'delete': actor_id
      }), 200

    except BaseException:
      abort(422)



  '''
  @HERE implementing endpoint
    DELETE /movies/<id>
  '''
  @app.route('/movies/<int:movie_id>', methods=['DELETE'])
  @requires_auth('delete:movie')
  def delete_movie(payload, movie_id):
    try:
      movie = Movie.query.filter(Movie.id == movie_id).one_or_none()

      if movie is None:
        abort(404)

      movie.delete()

      return jsonify({
        'success': True,
        'delete': movie_id
      }), 200

    except BaseException:
      abort(422)

  @app.errorhandler(422)
  def unprocessable(error):
    return jsonify({
      "success": False,
      "error": 422,
      "message": "unprocessable"
    }), 422


  @app.errorhandler(404)
  def unprocessable(error):
    return jsonify({
      "success": False,
      "error": 404,
      "message": "resource not found"
    }), 404

  @app.errorhandler(401)
  def unprocessable(error):
    return jsonify({
      "success": False,
      "error": 401,
      "message": "Unauthorized"
    }), 401
  return app

app = create_app()

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=8080, debug=True)