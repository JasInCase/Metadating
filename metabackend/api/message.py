"""Returns a hello world string!"""
import flask
import metabackend
import json
from flask import request
from metabackend.api.ai_model import ai_response 
from metabackend.api.db import find_match


@metabackend.app.route('/api/v1/getmsg', methods=['POST'])
def respond_to_message_frontend():
    data = request.get_json()
    array_msgs = data["msgs"]
    # print("Current user:", flask.session['username'])
    # TODO: eventually get profile from database
    # print("Flask session:", flask.session)
    # print(data)
    match_id = data["matchid"]
    print("Match ID:", match_id)
    # match_id = flask.session['matchId']
    match = find_match(match_id)
    print(match)

#     profile = {
#         'name': "Jayce",
#         'age': '24',
#         'gender': "male",
#         'interests': "Metal, sushi, astrology, space, music"
#     }

    # TODO s:
    # Append message to list of messages associated with the match
    # Call AI and get response
    # Send response to user

    response = ai_response(array_msgs, match)
    context = {
        'apiMessage': response
    }
    return flask.jsonify(**context)
