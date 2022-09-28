"""Returns a hello world string!"""
import flask
import metabackend

@metabackend.app.route('/api/v1/hello/')
def hello():
    """Returns a hello world string for testing the api"""
    context = {
        'string': "Hello world!"
    }

    return flask.jsonify(**context)
