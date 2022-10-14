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
    
    db_client = pymongo.MongoClient('mongodb+srv://metadating:masonjars449@metadating.nws30am.mongodb.net/?retryWrites=true&w=majority')
    db = db_client.get_database('Metadating')
    return db


# Use LocalProxy to read the global db instance with just `db`
db = LocalProxy(get_db)

def add_match(match):
    """Add a match to the matches collection."""
    return db.matches.insert_one(match)


def add_user(username, password, email):
    """Add a user to the users collection."""
    user_obj = {
        'username': username,
        'password': password,
        'email': email,
        'created': datetime.utcnow()
    }
    return db.users.insert_one(user_obj)


def find_match(match_id):
    return db.matches.find_one({'_id': ObjectId(match_id)})

def find_user(username):
    return db.users.find_one({'_username': username})

def update_conversation_with_profile(match_id, messages):
    return db.matches.update_one(
        { '_id': ObjectId(match_id) },
        { '$set': {'messages': messages} }
    )