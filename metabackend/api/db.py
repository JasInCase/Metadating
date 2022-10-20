import bson

from flask import current_app, g
from werkzeug.local import LocalProxy
from flask_pymongo import pymongo

from datetime import datetime
from pymongo.errors import DuplicateKeyError, OperationFailure
from bson.objectid import ObjectId
from bson.errors import InvalidId


def get_db():
    """
    Configuration method to return db instance
    """

    db_client = pymongo.MongoClient(
        'mongodb+srv://metadating:masonjars449@metadating.nws30am.mongodb.net/?retryWrites=true&w=majority')
    db = db_client.get_database('Metadating')
    return db


# Use LocalProxy to read the global db instance with just `db`
db = LocalProxy(get_db)


def add_match(match):
    """Add a match to the matches collection."""
    return db.matches.insert_one(match)


def add_user(username, password):
    """Add a user to the users collection."""
    user_obj = {
        'username': username,
        'password': password,
        'created': datetime.utcnow()
    }
    return db.users.insert_one(user_obj)


def find_match(match_id):
    return db.matches.find_one({'_id': ObjectId(match_id)})


def find_user(username):
    """Finds a single user queried by username."""
    cursor = db.users.find({'username': username}, limit=1)
    
    list_users = list(cursor)

    if len(list_users) == 0:
        return None

    return list_users[0]


def update_conversation_with_profile(match_id, messages):
    return db.matches.update_one(
        {'_id': ObjectId(match_id)},
        {'$set': {'messages': messages}}
    )
