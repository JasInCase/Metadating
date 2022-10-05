import bson

from flask import current_app, g
from werkzeug.local import LocalProxy
from flask_pymongo import pymongo

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

def add_match(name):
    match_doc = { 'name': name }
    return db.matches.insert_one(match_doc)