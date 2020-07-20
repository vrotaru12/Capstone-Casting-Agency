# Coffee Shop Backend

## Getting Started

### Installing Dependencies

#### Python 3.7

Follow instructions to install the latest version of python for your platform in the [python docs](https://docs.python.org/3/using/unix.html#getting-and-installing-the-latest-version-of-python)

#### Virtual Enviornment

We recommend working within a virtual environment whenever using Python for projects. This keeps your dependencies for each project separate and organaized. Instructions for setting up a virual enviornment for your platform can be found in the [python docs](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/)
pip install virtualenv
py -m venv env
./env/Scripts/activate

#### PIP Dependencies

Once you have your virtual environment setup and running, install dependencies by naviging to the `/backend` directory and running:

```bash
pip install -r requirements.txt
```

This will install all of the required packages we selected within the `requirements.txt` file.

##### Key Dependencies

- [Flask](http://flask.pocoo.org/)  is a lightweight backend microservices framework. Flask is required to handle requests and responses.

- [SQLAlchemy](https://www.sqlalchemy.org/) and [Flask-SQLAlchemy](https://flask-sqlalchemy.palletsprojects.com/en/2.x/) are libraries to handle the lightweight sqlite database. Since we want you to focus on auth, we handle the heavy lift for you in `./src/database/models.py`. We recommend skimming this code first so you know how to interface with the Drink model.

- [jose](https://python-jose.readthedocs.io/en/latest/) JavaScript Object Signing and Encryption for JWTs. Useful for encoding, decoding, and verifying JWTS.

## Running the server

From within the `./src` directory first ensure you are working using your created virtual environment.

Each time you open a new terminal session, run:

```bash
export FLASK_APP=api.py;
```

To run the server, execute:

```bash
FLASK_APP=app.py FLASK_DEBUG=true flask run
```

The `--reload` flag will detect file changes and restart the server automatically.

## Tasks

### Setup Auth0

1. Create a new Auth0 Account
2. Select a unique tenant domain
3. Create a new, single page web application
4. Create a new API
    - in API Settings:
        - Enable RBAC
        - Enable Add Permissions in the Access Token
5. Create new API permissions:
    - `get:actors`
    - `get:actor-detail`
    - `post:actors`
    - `patch:actors`
    - `delete:actors`
    - `get:movie`
    - `post:movie`
    - `patch:movie`
    - `delete:movie`
6. Create new roles for:
    - Casting Assistant
      - Can view actors and movies
    - Casting Director
      - All permissions a Casting Assistant has and…
      - Add or delete an actor from the database
      - Modify actors or movies
    - Executive Producer
      - All permissions a Casting Director has and…
      - Add or delete a movie from the database
7. Test your endpoints with [Postman](https://getpostman.com). 
    - Register 3 users/more - assign the Casting Assistant role to one, Casting Director role to the other and Executive Producer role to somebody else.
    - Sign into each account and make note of the JWT.
    - Import the postman collection `./starter_code/backend/udacity-fsnd-udaspicelatte.postman_collection.json`
    - Right-clicking the collection folder for barista and manager, navigate to the authorization tab, and including the JWT in the token field (you should have noted these JWTs).
    - Run the collection and correct any errors.
    - Export the collection overwriting the one we've included so that we have your proper JWTs during review!

8. Log in auth0 to get the token for all users by accessing the following url with your details of the app:
`https://{{YOUR_DOMAIN}}/authorize?audience={{API_IDENTIFIER}}&response_type=token&client_id={{YOUR_CLIENT_ID}}&redirect_uri={{YOUR_CALLBACK_URI}}`

    Application Login URI: https://127.0.0.1:4200/login
    Allowed Callback URLs: http://127.0.0.1:4200/tabs/user-page
    Allowed Logout URLs: https://127.0.0.1:4200/logout



### Implement The Server

There are `@TODO` comments throughout the `./backend/src`. We recommend tackling the files in order and from top to bottom:

1. `./src/auth/auth.py`
2. `./src/api.py`

Install autopep8 for formatting the code in api.py
    pip install --upgrade autopep8
   command: autopep8 --in-place --aggressive --aggressive <filename>

Install pycodestyle for checking if there are any style mistakes in the code:
    pip install pycodestyle
    command: pycodestyle --first <filename>