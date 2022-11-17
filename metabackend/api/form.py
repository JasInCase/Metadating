"""Returns a hello world string!"""
import flask
import metabackend
from .db import add_match, insert_real_conversation

@metabackend.app.route('/api/v1/form/', methods=['POST'])
def store_form_data():
    """Returns confirmation that form data was recieved"""

    name = flask.request.json["name"]
    age = flask.request.json["age"]
    gender = flask.request.json["gender"]
    interests = flask.request.json["interests"]
    user_id = flask.request.json["userId"]

    match = {'name': name, 'age': age, 'gender': gender, 'interests': interests, 'user_id': user_id}
    response = add_match(match)
    match_id = str(response.inserted_id)
    insert_real_conversation(match_id, user_id)

    context = {"string": match_id}

    # TODO: Add error handling if this ever goes to prod
    
    '''
    response = add_match(match)
    status_code = 200
    if response.acknowledged == True:
        match_id = str(response.inserted_id)
        flask.session['matchId'] = match_id
        print("Response acknowledged")
    else:
        status_code = 502
    
    print("New Flask Session:", flask.session)
    context = {"string": match_id}
    '''

    return flask.jsonify(**context), status_code