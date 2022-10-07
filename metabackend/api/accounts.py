"""
Authentication and authorization for the API.

URLs include:
/api/v1/accounts/ with operations - login, logout, create, update, delete
"""
import flask
import metabackend
from metabackend.api.utils import check_login, react_site_redirect
import hashlib


@metabackend.app.route('/api/v1/accounts/', methods=['POST'])
def accounts():
    """Handles accounts requests."""
    # Handle the specific operation
    if 'operation' not in flask.request.form:
        flask.abort(400)

    oper = flask.request.form["operation"]

    if oper == 'login':
        return do_login()

    elif oper == 'logout':
        return do_logout()

    elif oper == 'create':
        return do_create()

    elif oper == 'update':
        return do_update()

    elif oper == 'delete':
        return do_delete()

    else:
        flask.abort(400)


def do_login():
    """User login."""
    # Error checking
    if 'username' not in flask.request.form or 'password' not in flask.request.form:
        flask.abort(400)

    username = flask.request.form['username']
    pwd = flask.request.form['password']

    if not username or not pwd:
        flask.abort(400)

    # Check the password
    stored_pwd = get_stored_user_pwd(username)

    if does_pwd_match_hashed_pwd(pwd, stored_pwd):
        flask.session['username'] = username
        return react_site_redirect('/')

    else:
        flask.abort(403)


def do_logout():
    """User logout."""
    flask.session.pop('username', None)
    return metabackend.api.utils.react_site_redirect('/')


def do_create():
    pass


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
