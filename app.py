import json
from flask import Flask, render_template, request, Response
from flask import flash, redirect, url_for, jsonify, abort
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import Form
from models import Movie, Cast, Actor, db_drop_and_create_all, setup_db
from auth.auth import AuthError, requires_auth
from flask_cors import CORS
from sqlalchemy import distinct
import os


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__)
    setup_db(app)
    CORS(app)

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

    # db_drop_and_create_all()

    @app.route('/')
    def main_page():
        return render_template('index.html')

    @app.route('/form')
    def form_page():
        return render_template('form.html')
    
    @app.route('/about')
    def about_page():
        return render_template('about.html')
    
    @app.route('/actors/<int:actor_id>')
    def show_actor(actor_id):
        casting = Cast.query.filter(Cast.actor_id == actor_id).distinct(Cast.actor_id, Cast.movie_id)
        actor = [cast.detail() for cast in casting]
        length =  len(actor)
        if (length == 0):
            allactors = Actor.query.filter(Actor.id == actor_id)
            actor = [act.details() for act in allactors]
        allMovies =[ movie.short() for movie in Movie.query.all()]
        actor.append(allMovies)
        return render_template('show_actor.html', actors=actor)

    @app.route('/movies/<int:movie_id>')
    def show_movie(movie_id):
        casting = Cast.query.filter(Cast.movie_id == movie_id).distinct(Cast.movie_id, Cast.actor_id)
        movies = [cast.detail() for cast in casting]
        length =  len(movies)
        if (length == 0):
            allMovies = Movie.query.filter(Movie.id == movie_id)
            movies = [mov.details() for mov in allMovies]

        allActors =[ actor.short() for actor in Actor.query.all()]
        movies.append(allActors)
        return render_template('show_movie.html', movies=movies)

    '''
  @HERE implementing endpoint
    GET /actors
  '''
    @app.route('/actors')
    # @requires_auth('get:actor')
    # def get_actors(payload):
    def get_actors():
        actors = Actor.query.all()

        if len(actors) == 0:
            abort(404)
        
        return jsonify({
            'success': True,
            'actors': [actor.details() for actor in actors]
        }), 200
        
        # return render_template('actors.html', actors=actors)

    '''
  @HERE implementing endpoint
    GET /actors-detail
  '''
    @app.route('/actors-detail')
    # @requires_auth('get:actor-detail')
    # def get_actors_detail(payload):
    def get_actors_detail():
        actors = Actor.query.all()

        if len(actors) == 0:
            abort(404)
        return render_template('actors.html', actors=actors)

    '''
  @HERE implementing endpoint
    GET /movies
  '''
    @app.route('/movies')
    # @requires_auth('get:movie')
    # def get_movies(payload):
    def get_movies():
        movies = Movie.query.all()

        if len(movies) == 0:
            abort(404)
        return render_template('movies.html', movies=movies)

    '''
  @HERE implementing endpoint
    GET /movies / show actor by id
  '''

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
        newdescription = body['description']
        newpicture = body['image']

        try:
            new_actor = Actor(name=newname, age=newage, gender=newgender,description=newdescription, image=newpicture)
            new_actor.insert()
            return jsonify({'success': True, 'actors': [new_actor.details()]})

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
        newdescription = body['description']
        newpicture = body['image']

        try:
            new_movie = Movie(title=newtitle, release_date=newdate, description=newdescription, image=newpicture)
            new_movie.insert()
            return jsonify({'success': True, 'movies': [new_movie.short()]})

        except BaseException:
            abort(422)



    # '''
    # @HERE implementing endpoint
    #     POST /CAST
    # '''

    @app.route('/cast-actor', methods=['POST'])
    @requires_auth('post:actor')
    def add_actors_in_cast(payload):
        body = request.get_json()

        movie_id = body['movie_id']
        actor_id = body['actor_id']

        try:
            new_cast = Cast(movie_id=movie_id, actor_id=actor_id)
            new_cast.insert()
            return jsonify({'success': True, 'cast': [new_cast.detail()]})

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
            if 'description' in body:
                actor.description = body.get('description')
            if 'image' in body:
                actor.image = body.get('image')

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
            if 'description' in body:
                movie.description = body.get('description')
            if 'image' in body:
                movie.image = body.get('image')

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

    @app.errorhandler(AuthError)
    def auth_error(error):
        return jsonify({
            "success": False,
            "error": error.status_code,
            "message": error.error
        }), error.status_code

    return app


app = create_app()
app.secret_key = os.getenv('SECRET')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
