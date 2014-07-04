import logging
import os

from .base import *



################################################################################
### System  ####################################################################
################################################################################

DEBUG = TEMPLATE_DEBUG = True
TEMPLATE_STRING_IF_INVALID = '<VAR_NONEXISTANT>'

# Set default sqlite database for development.
DATABASES['default'] = {
    'ENGINE': 'django.db.backends.sqlite3',
    'NAME': os.path.join(DATA_DIR, 'db', 'dev.sqlite3'),
}

DEVELOPMENT_APPS = tuple()

# Note: MIGHT BE OVERWRITTEN IN ENV SETTINGS. SEE dev.py.
INSTALLED_APPS = INTERNAL_APPS + DEVELOPMENT_APPS + CONTRIB_APPS + CORE_APPS



################################################################################
### Administration and security ################################################
################################################################################

SECRET_KEY = 'shed_lontcjg44kr!bzxm8z)5t^1i51cl_4c1waz+o2_=w84$8'
ALLOWED_HOSTS = ['*']



################################################################################
### Email ######################################################################
################################################################################

# In development,  just print emails to console instead of sending them.
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'



################################################################################
### Logging ####################################################################
################################################################################

LOGGING['handlers'] = {
    'file': {
        'level': 'DEBUG',
        'class': 'logging.FileHandler',
        'filename': os.path.join(DATA_DIR, 'logs', 'debug.log'),
        'mode': 'a',
    },
    'console':{
        'level': 'DEBUG',
        'class': 'logging.StreamHandler',
        'formatter': 'verbose',
    },

}

LOGGING['loggers'] = {
    'django': {
        'handlers': ['file', 'console'],
        'level': 'DEBUG',
        'propagate': True,
    },
    'django.db': {
        'handlers': ['file', 'console'],
        'level': 'INFO',
        'propagate': False
    }
}
