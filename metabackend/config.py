"""Metabackend development configuration"""
import pathlib

APPLICATION_ROOT = '/'

SECRET_KEY = '883d77f41d1d18d58acfb40d'
SESSION_COOKIE_NAME = 'login'
FLASK_ROUTE = 'http://localhost:3000/'

# Config variables
METABACKEND_ROOT = pathlib.Path(__file__).resolve().parent.parent
FRONTEND_FOLDER = METABACKEND_ROOT/'metadating-frontend'
