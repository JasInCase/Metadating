"""Returns a hello world string!"""
import flask
import metabackend
from .db import add_match

@metabackend.app.route('/api/v1/form/', methods=['POST'])
def store_form_data():
    """Returns confirmation that form data was recieved"""

    name = flask.request.json["name"]
    age = flask.request.json["age"]
    gender = flask.request.json["gender"]
    interests = flask.request.json["interests"]
    
    match = {'name': name, 'age': age, 'gender': gender, 'interests': interests}
    response = add_match(match)

    status_code = 200
    match_id = str(response.inserted_id)

    if response.acknowledged == True:
        flask.session['matchId'] = match_id
        print("Response acknowledged")
    else:
        status_code = 502
    
    print("New Flask Session:", flask.session)
    context = {"string": match_id}

    return flask.jsonify(**context), status_code