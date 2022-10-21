"""Returns a hello world string!"""
import flask
import metabackend
import json
from flask import request
from metabackend.api.ai_model import ai_response 
from metabackend.api.db import find_match, update_conversation_with_profile


@metabackend.app.route('/api/v1/getmsg', methods=['POST'])
def respond_to_message_frontend():
    data = request.get_json()
    user_message = data["userMessage"]
    # messages = data["msgs"]
    match_id = data["matchId"]
    user_id = data["userId"]
    match = find_match(match_id)
    
    # TODO: Exception handling if match id is not found

    messages = []

    if "messages" in match:
        messages = match["messages"]
    
    messages.append(user_message)
    profile_message_response = ai_response(messages, match)
    messages.append(profile_message_response)
    
    update_conversation_with_profile(match_id, messages)

    context = {
        'apiMessage': profile_message_response
    }

#     profile = {
#         'name': "Jayce",
#         'age': '24',
#         'gender': "male",
#         'interests': "Metal, sushi, astrology, space, music"
#     }

    return flask.jsonify(**context)
