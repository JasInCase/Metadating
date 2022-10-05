"""Returns a hello world string!"""
import flask
import metabackend


@metabackend.app.route('/api/v1/received/', methods=['POST'])
def received():
    """Returns confirmation that form data was recieved"""
    context = {
        'string': "Recieved form data!"
    }

    return flask.jsonify(**context)