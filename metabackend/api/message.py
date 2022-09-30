"""Returns a hello world string!"""
import flask
import metabackend
import json

@metabackend.app.post('/api/v1/message/')
def message():
    """Returns a custom message to the user from the AI's perspective"""
    userMessage = json.loads(flask.request.data.decode("utf-8"))["userMessage"]
    context = {
        'apiMessage': "I will not date you!"
    }

    return flask.jsonify(**context)