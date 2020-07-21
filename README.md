# Casting Agency App
Casting Agency is an app that is responsible for creating movies, adding actors and assigning them to those movies. 
This is my capstone project for the Udacity Full Stack Web Developer nanodegree.

Hosted on heroku. [Link](https://vr-casting-agency.herokuapp.com/).
## Getting Started

### Installing Dependencies

#### PIP Dependencies

All dependencies are already listed in the `requirements.txt` file. 

```bash
pip install -r requirements.txt
```

This will install all of the required packages within the `requirements.txt` file.

## Authentication
### Setup Auth0
In order to create 3 different roles that will log into the app, the following configurations were applied:
1. A new Auth0 Account was created
2. A unique tenant domain was selected
3. A new, single page web application was created
4. A new API was created 
    - in API Settings:
        - Enabled RBAC
        - Enabled Add Permissions in the Access Token
5. New API with the following permissions:
    - `get:actors`
    - `get:actor-detail`
    - `post:actors`
    - `patch:actors`
    - `delete:actors`
    - `get:movie`
    - `post:movie`
    - `patch:movie`
    - `delete:movie`
6. New roles were created
    - Casting Assistant
      - Can view actors and movies
        - `get:actors`
        - `get:actor-detail`
        - `post:actors`
      ```
      email: gurdisfilea@gmail.com
      password: !!!!Valerica!!
      ```
    - Casting Director
      - All permissions a Casting Assistant has and…
      - Add or delete an actor from the database
      - Modify actors or movies
        - `get:actors`
        - `get:actor-detail`
        - `post:actors`
        - `patch:actors`
        - `delete:actors`
        - `get:movie`
        - `post:movie`
        - `patch:movie`
        - `delete:movie`
      ```
      email: vrotaru@mastercontrol.com
      password: !!Password!!
      ```
    - Executive Producer
      - All permissions a Casting Director has and…
      - Add or delete a movie from the database
        - `get:actors`
        - `get:actor-detail`
        - `post:actors`
        - `delete:actors`
        - `get:movie`
        - `post:movie`
        - `delete:movie`
      ```
      email: gurdisvaleriu@gmail.com
      password: !!!!Password12
      ```
7. Test your endpoints with [Postman](https://getpostman.com). 


## Endpoints

### `GET /movies`

Gets all movies from the db.

Response:

```json5
{
  "movies": [
    {
      "id": 1,
      "release_date": "02-02-2020",
      "title": "Catch me if you can"
    },
    {
      "id": 2,
      "title": "Test Title",
      "release_date": "09-10-20",
    }
  ],
  "success": true
}
```

### `POST /movies`

Adds a new movie to the db.

Data:

```json5
{
  "title": "Test title",
  "release_date": "09-10-20"
}
```

Response:

```json5
{
  "movies": [
    {
      "id": 3,
      "title": "Test title"
    }
  ],
  "success": true
}
```

### `PATCH /movies/<int:id>`

Edit data on a movie in the db.

Data:

```json5
{
  "title": "test patch"
}
```

Response:

```json5
{
  "movies": [
    {
      "id": 3,
      "title": "test patch"
    }
  ],
  "success": true
}
```

### `DELETE /movies/<int:id>`

Delete a movie from the db.

Response:

```json5
{
  "success": true,
  "delete": 1
}
```

### `GET /actor-details`

Gets all actors from the db.

Response:

```json5
{
  "actors": [
    {
      "id": 1,
      "name": "Test",
      "age": 32,
      "gender": "Test"
    }
  ],
  "success": true
}
```

### `GET /actors`

Gets all actors from the db with less details.

Response:

```json5
{
  "actors": [
    {
      "id": 1,
      "name": "Test",
    }
  ],
  "success": true
}
```

### `POST /actors`

Adds a new actor to the db.

Data:

```json5
{
  "name": "Test",
  "age": 10,
  "gender": "Test"
}
```

Response:

```json5
{
  "success": true,
  "actors": [
    {
      "id": 2,
      "name": "Test",
    }
  ],
}
```

### `PATCH /actors/<int:id>`

Edit data on a actor in the db.

Data:

```json5
{
  "name": "test patch",
}
```

Response:

```json5
{
  "success": true,
  "actors": [
    {
      "id": 2,
      "name": "Test",
      "age": 10,
      "gender": "M"
    }
  ],
}
```

### `DELETE /actors/<int:id>`

Delete an actor from the db.

Response:

```json5
{
  "success": true,
  "delete": 1
}
```

## Tests
To run the tests, run `py tests.py`.