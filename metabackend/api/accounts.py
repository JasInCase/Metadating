"""
Authentication and authorization for the API.

URLs include:
/api/v1/accounts/ with operations - login, logout, create, update, delete
"""
import flask
import metabackend
from metabackend.api.db import insert_user, find_user
import metabackend
from metabackend.api.utils import check_login, react_site_redirect
import hashlib
import uuid


@metabackend.app.route('/api/v1/accounts/', methods=['POST'])
def accounts():
    """Handles accounts requests."""
    # Handle the specific operation
    if 'operation' not in flask.request.json:
        flask.abort(418)

    # Note I am sending info as json because
    # of how im doing input validation
    # So use flask.request.json instead of flask.request.form
    # everything else is the same!
    oper = flask.request.json["operation"]

    if oper == 'login':
        return do_login()

    if oper == 'logout':
        return do_logout()

    if oper == 'create':
        return do_create()

    if oper == 'update':
        return do_update()

    if oper == 'delete':
        return do_delete()

    flask.abort(400)


def do_login():
    """User login."""
    # Error checking
    if 'username' not in flask.request.json or 'password' not in flask.request.json:
        flask.abort(400)

    username = flask.request.json['username']
    pwd = flask.request.json['password']

    if not username or not pwd:
        flask.abort(403)

    stored_user = get_stored_user(username)
    stored_pwd = stored_user['password']
    stored_user_id = str(stored_user['_id'])

    if does_pwd_match_hashed_pwd(pwd, stored_pwd):
        flask.session['username'] = username # Doesn't help in our session management
        flask.session['userId'] = stored_user_id # ^
        
        context = { 'redirect': '/form',
                    'username': username,
                    'userId': stored_user_id
                  }
        return flask.jsonify(**context), 201

    flask.abort(403)


def do_logout():
    """User logout."""
    flask.session.pop('username', None)
    return metabackend.api.utils.react_site_redirect('/')


def do_create():
    """User creation."""
    # Error checking
    if 'username' not in flask.request.json or 'password' not in flask.request.json:
        flask.abort(400)

    username = flask.request.json['username']
    pwd = flask.request.json['password']

    # Error checking
    if not username or not pwd:
        flask.abort(400)

    # Make sure the user doesn't already exist
    if find_user(username) is not None:
        flask.abort(409)

    # Generate the password hash
    algo = 'sha512'
    salt = uuid.uuid4().hex
    hashed_pwd = generate_hashed_pwd(algo, salt, pwd)
    stored_pwd = '$'.join([algo, salt, hashed_pwd])

    # Add the user to the database
    response = insert_user(username, stored_pwd)
    new_user_id = str(response.inserted_id)

    if response.acknowledged:
        flask.session['username'] = username
        flask.session['user_id'] = new_user_id
    else:
        flask.abort(503)

    context = {'redirect': '/form', 'username': username, 'userId': new_user_id }         
    return flask.jsonify(**context), 201


@check_login
def do_update():
    pass


@check_login
def do_delete():
    pass

def get_stored_user(username):
    """Get the stored user for based on username"""
    user_obj = find_user(username)

    if user_obj is None:
        flask.abort(403)

    return user_obj


def get_stored_user_pwd(username):
    """Get the stored password for a user."""
    # Password is just 'password'
    # hashed_pwd = 'sha512$a45ffdcc71884853a2cba9e6bc55e812$c739cef1aec45c6e345c'
    # hashed_pwd += '8463136dc1ae2fe19963106cf748baf87c7102937aa96928aa1db7fe1d8d'
    # hashed_pwd += 'a6bd343428ff3167f4500c8a61095fb771957b4367868fb8'

    user_obj = find_user(username)

    if user_obj is None:
        flask.abort(403)

    return user_obj['password']


def does_pwd_match_hashed_pwd(pwd, hashed_pwd):
    """Check a password against a hashed password."""
    algo, salt, stored_pwd_hash = hashed_pwd.split('$')

    return generate_hashed_pwd(algo, salt, pwd) == stored_pwd_hash


def generate_hashed_pwd(algo, salt, pwd):
    """Generate a hashed password."""
    hash_obj = hashlib.new(algo)
    pwd_salted = salt + pwd
    hash_obj.update(pwd_salted.encode('utf-8'))
    hashed_pwd = hash_obj.hexdigest()

    return hashed_pwd
