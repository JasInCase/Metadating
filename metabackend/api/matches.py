import flask
import metabackend
import json
from flask import request
from metabackend.api.ai_model import ai_response 
from metabackend.api.db import find_matches, find_real_conversation, find_practice_conversations

@metabackend.app.route('/api/v1/matches/<user_id>', methods=['GET'])
def get_matches(user_id):
    matches = find_matches(user_id)

    result_matches = []

    for match in matches:
        match_id = str(match['_id'])
        real_conversation = find_real_conversation(None, user_id, match_id)
        practice_conversations = find_practice_conversations(user_id, match_id) # array of ids
        result_match = { 'match': match, 'real_conversation': real_conversation, 'practice_conversations': practice_conversations }
        result_matches.append(result_match)


    context = {
        'matches': result_matches
    }

    return flask.jsonify(**context)