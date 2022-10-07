"""
Utility functions.

Functions included:
@check_login

react_site_redirect
"""
import flask
import metabackend


def check_login(func):
    """
    Decorator for login check.

    Checks if the user is logged in before running the function.
    Redirects to login page otherwise.
    """
    def login_checked_function():
        if 'username' not in flask.session or not flask.session['username']:
            flask.abort(403)

        return func()

    return login_checked_function


def react_site_redirect(route):
    """Redirect to a React site."""
    react_route = metabackend.app.config['FLASK_ROUTE'] + route
    return flask.redirect(react_route)
