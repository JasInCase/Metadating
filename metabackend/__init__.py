"""Metadating Backend Package Initializer"""
import flask

# Create the app:
app = flask.Flask(__name__)

app.config.from_object('metabackend.config')

import metabackend.api # noqa: E402  pylint: disable=wrong-import-position
