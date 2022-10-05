"""Returns a hello world string!"""
import flask
import metabackend
from .db import add_match

@metabackend.app.route('/api/v1/hello/', methods=['GET'])
def hello():
    """Returns a hello world string for testing the api"""
    context = {
        'string': "Hello world!"
    }

    return flask.jsonify(**context)

@metabackend.app.route('/api/v1/recieved/', methods=['POST'])
def recieved():
    """Returns confirmation that form data was recieved"""
    context = {
        'string': "Recieved form data!"
    }

    return flask.jsonify(**context)
