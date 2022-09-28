"""Metabackend development configuration"""
import pathlib

APPLICATION_ROOT = '/'

SESSION_COOKIE_NAME = 'login'

# Config variables
METABACKEND_ROOT = pathlib.Path(__file__).resolve().parent.parent
FRONTEND_FOLDER = METABACKEND_ROOT/'metadating-frontend'
