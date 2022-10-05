"""Metadating Backend Package Initializer"""
import flask
from flask_cors import CORS

# Create the app:
app = flask.Flask(__name__)
CORS(app)

app.config.from_object('metabackend.config')

import metabackend.api # noqa: E402  pylint: disable=wrong-import-position
