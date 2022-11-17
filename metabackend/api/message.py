"""Returns a hello world string!"""
import flask
import metabackend
import json
from flask import request
from metabackend.api.ai_model import ai_response 
from metabackend.api.db import find_match, update_conversation_with_profile, find_real_conversation, update_real_conversation, find_practice_conversation, update_practice_conversation, insert_practice_conversation
import time

@metabackend.app.route('/api/v1/real-conversation/<real_conversation_id>/', methods=['GET'])
def get_real_conversation(real_conversation_id):
    real_conversation = find_real_conversation(real_conversation_id, None, None)
    context = {
        'realConversation': real_conversation
    }
    return flask.jsonify(**context)


@metabackend.app.route('/api/v1/real-conversation/<real_conversation_id>/message/', methods=['POST'])
def add_message_to_real_conversation(real_conversation_id):
    data = request.get_json()
    message = data["message"]
    is_user = data["is_user"]

    real_conversation = find_real_conversation(real_conversation_id, None, None)
    new_message = {'text': message, 'is_user': is_user}
    new_messages = real_conversation['messages'].append(new_message)
    update_real_conversation(real_conversation_id, new_messages)
    
    context = {
        'success': True
    }
    return flask.jsonify(**context)


# TODO: Test all routes and add practice conversation routes

@metabackend.app.route('/api/v1/practice-conversation/<practice_conversation_id>/', methods=['GET'])
def get_practice_conversation(practice_conversation_id):
    practice_conversation = find_practice_conversation(practice_conversation_id)
    context = {
        'practiceConversation': practice_conversation
    }
    return flask.jsonify(**context)

@metabackend.app.route('/api/v1/practice-conversation/<practice_conversation_id>/message/', methods=['POST'])
def add_message_to_practice_conversation(practice_conversation_id):
    data = request.get_json()
    message = data["message"]

    practice_conversation = find_practice_conversation(practice_conversation_id, None, None)
    new_message = {'text': message, 'is_user': True}
    new_messages = practice_conversation['messages'].append(new_message)
    # TODO: Call AI
    # TODO: Get response from AI and append to messages list
    update_practice_conversation(practice_conversation_id, new_messages)
    
    context = {
        'success': True
        # 'apiMessage': ai_message
    }
    return flask.jsonify(**context)

@metabackend.app.route('/api/v1/practice-conversation/', methods=['POST'])
def create_practice_conversation():
    data = request.get_json()
    user_id = data["userId"]
    match_id = data["matchId"]

    real_conversation = find_real_conversation(None, user_id, match_id)
    messages = real_conversation['messages']
    practice_conversation = insert_practice_conversation(match_id, user_id, messages)
    practice_conversation_id = str(practice_conversation.inserted_id)


    context = {
        'practiceConversationId': practice_conversation_id
    }
    return flask.jsonify(**context)

'''
@metabackend.app.route('/api/v1/getmsg', methods=['POST'])
def respond_to_message_frontend():
    data = request.get_json()
    user_message = data["userMessage"]
    match_id = data["matchId"]
    user_id = data["userId"]
    match = find_match(match_id)

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
'''