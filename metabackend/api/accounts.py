"""
Authentication and authorization for the API.

URLs include:
/api/v1/accounts/ with operations - login, logout, create, update, delete
"""
import flask
import metabackend
from metabackend.api.db import add_user, find_user
import metabackend
from metabackend.api.utils import check_login, react_site_redirect
import hashlib
import uuid


@metabackend.app.route('/api/v1/accounts/', methods=['POST'])
def accounts():
    """Handles accounts requests."""
    # Handle the specific operation
    print(flask.request.json)
    if 'operation' not in flask.request.json:
        flask.abort(400)

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
        flask.abort(400)

    # Check the password
    stored_pwd = get_stored_user_pwd(username)

    if does_pwd_match_hashed_pwd(pwd, stored_pwd):
        flask.session['username'] = username
        return {'redirect': '/form'}

    flask.abort(403)


def do_logout():
    """User logout."""
    flask.session.pop('username', None)
    return metabackend.api.utils.react_site_redirect('/')


def do_create():
    """User creation."""
    # Error checking
    if 'username' not in flask.request.json or 'password' not in flask.request.json \
        or 'email' not in flask.request.json:
        flask.abort(400)

    username = flask.request.json['username']
    pwd = flask.request.json['password']
    email = flask.request.json['email']

    if not username or not pwd or not email:
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
    add_user(username, stored_pwd, email)


@check_login
def do_update():
    pass


@check_login
def do_delete():
    pass


def get_stored_user_pwd(username):
    """Get the stored password for a user."""
    # Password is just 'password'
    hashed_pwd = 'sha512$a45ffdcc71884853a2cba9e6bc55e812$c739cef1aec45c6e345c'
    hashed_pwd += '8463136dc1ae2fe19963106cf748baf87c7102937aa96928aa1db7fe1d8d'
    hashed_pwd += 'a6bd343428ff3167f4500c8a61095fb771957b4367868fb8'
    return hashed_pwd


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
