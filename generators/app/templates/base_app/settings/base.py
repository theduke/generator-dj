"""
Django settings for <%= siteName %>.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/

List of environment variables available:

ENV - the active environment

DEBUG - 1 or 0
TEMPLATE_DEBUG - 1 or 0

PUBLIC_DIR - the directory that holds publicly accessible files,
             expected subdirs are "media" and "static"
             if you want another setup, manually alter MEDIA_ROOT and STATIC_ROOT
DATA_DIR

SECRET_KEY - the secret key
DB_ENGINE - the DB engine for the default DB
DB_NAME - the DB name for the default DB

ADMINS - the site admins, specify like this: ADMINS="admin1,admin 1@domain.com;admin 2,admin2@domain.com"
                          (seperate admins with ; and name from email with ,)

INTERNAL_IPS - separate by SPACE, like: INTERNAL_IPS="127.0.0.1 123.123.123.123"

EMAIL_BACKEND
EMAIL_HOST
EMAIL_PORT
EMAIL_HOST_USER
EMAIL_HOST_PASSWORD
EMAIL_USE_TLS


To handle other variables via env, just define them like this:

VAR_NAME = os.environ.get('ENV_VAR_NAME', 'default_value')
"""

import os
import warnings

# Disable naive datetime warnings for naive datetime in iPython.
#import exceptions
#warnings.filterwarnings("ignore", category=exceptions.RuntimeWarning, module='django.db.backends.sqlite3.base', lineno=53)
#warnings.filterwarnings("ignore", category=exceptions.RuntimeWarning, module='django.db.models.fields', lineno=903)

################################################################################
### Application settings #######################################################
################################################################################

# Name 
SITE_NAME = "<%= siteName %>"

# Main host/domain name for this project.
HOST = "<%= siteHost %>"

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.realpath(__file__))))))

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.join(ROOT_DIR, 'app')
DATA_DIR = os.environ.get('PUBLIC_DIR', os.path.join(BASE_DIR, 'data'))
PUBLIC_DIR = os.environ.get('PUBLIC_DIR', os.path.join(BASE_DIR, 'public'))

WSGI_APPLICATION = '<%= siteName %>.wsgi.application'

ENV = os.environ.get('ENV', 'production')



################################################################################
### System  ####################################################################
################################################################################

DATABASES = {}

DEBUG = bool(os.environ.get('DEBUG', True if ENV == 'dev' else False))
TEMPLATE_DEBUG = bool(os.environ.get('TEMPLATE_DEBUG', True if ENV == 'dev' else False))


### Django core apps. ###
CORE_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Site framework.
    'django.contrib.sites',
)

CONTRIB_APPS = (
    # Schema migration.
    'south',
)

INTERNAL_APPS = (
    'core',
    '<%= siteName %>',
)

# Note: MIGHT BE OVERWRITTEN IN ENV SETTINGS. SEE dev.py.
INSTALLED_APPS = INTERNAL_APPS + CONTRIB_APPS + CORE_APPS


##############
# MIDDLEWARE #
##############

# List of middleware classes to use.  Order is important; in the request phase,
# this middleware classes will be applied in the order given, and in the
# response phase the middleware will be applied in reverse order.
MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
#     'django.middleware.http.ConditionalGetMiddleware',
#     'django.middleware.gzip.GZipMiddleware',
)



############
# FIXTURES #
############

# The list of directories to search for fixtures
FIXTURE_DIRS = (
    os.path.join(DATA_DIR, 'fixtures'),
)



################################################################################
### Administration and security ################################################
################################################################################

SECRET_KEY = os.environ.get('SECRET_KEY')

# People who get code error notifications.
# In the format (('Full Name', 'email@example.com'), ('Full Name', 'anotheremail@example.com'))
# To specify with environment var, set it like this:
# ADMINS="admin1,admin1@domain.com;admin2,admin2@domain.com"
ADMINS = [l.split(',') for l in os.environ.get('ADMINS', '').split(';')]

# Not-necessarily-technical managers of the site. They get broken link
# notifications and other various emails.
MANAGERS = ADMINS

# Tuple of IP addresses, as strings, that:
INTERNAL_IPS = os.environ.get('INTERNAL_IPS', '127.0.0.1').split(' ')

# Hosts/domain names that are valid for this site.
# "*" matches anything, ".example.com" matches example.com and all subdomains
# For dev environment, this is set to all hosts.
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(' ')



################################################################################
### AUTHENTICATION #############################################################
################################################################################

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
)

LOGIN_URL = '/accounts/login/'
LOGOUT_URL = '/accounts/logout/'
LOGIN_REDIRECT_URL = '/'

# The number of days a password reset link is valid for
PASSWORD_RESET_TIMEOUT_DAYS = 3



################################################################################
### Language , timezone and i18n ###############################################
################################################################################

# Local time zone for this installation. All choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name (although not all
# systems may support all possibilities). When USE_TZ is True, this is
# interpreted as the default user time zone.
TIME_ZONE = 'Europe/Vienna'

# If you set this to True, Django will use timezone-aware datetimes.
USE_TZ = True

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'de-DE'

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to True, Django will format dates, numbers and calendars
# according to user current locale.
USE_L10N = False

# Default accepted input formats for Forms.
# Use them like this on a form field: 
# form django_baseline import get_config
# date = forms.DateField(input_formats=get_config("DATE_INPUT_FORMATS"))

DATE_INPUT_FORMATS = ["%d.%m.%Y", "%Y-%m-%d"]
DATETIME_INPUT_FORMATS = ["%d.%m.%Y %H:%M", "%Y-%m-%d %H:%M"]



################################################################################
### Email ######################################################################
################################################################################

# Email address that error messages come from.
SERVER_EMAIL = 'admin@' + HOST

EMAIL_SUBJECT_PREFIX = "[{n}] ".format(n=SITE_NAME)

# The email backend to use. For possible shortcuts see django.core.mail.
EMAIL_BACKEND = os.environ.get('EMAIL_BACKEND', 'django.core.mail.backends.smtp.EmailBackend')

# Host for sending email.
EMAIL_HOST = os.environ.get('EMAIL_HOST', 'localhost')

# Port for sending email.
EMAIL_PORT = int(os.environ.get('EMAIL_PORT', 25))

# Optional SMTP authentication information for EMAIL_HOST.
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '')
EMAIL_USE_TLS = bool(os.environ.get('EMAIL_USE_TLS', False))

# Default email address to use for various automated correspondence from
# the site managers.
DEFAULT_FROM_EMAIL = 'no-reply@' + HOST



################################################################################
### Templates ##################################################################
################################################################################

# List of locations of the template source files, in search order.
TEMPLATE_DIRS = ()

TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)

# List of processors used by RequestContext to populate the context.
TEMPLATE_CONTEXT_PROCESSORS = (
    'django.contrib.auth.context_processors.auth',
    'django.core.context_processors.debug',
    'django.core.context_processors.i18n',
    'django.core.context_processors.media',
    'django.core.context_processors.static',
    'django.core.context_processors.tz',
    'django.core.context_processors.request',
    'django.contrib.messages.context_processors.messages',
)

# Output to use in template system for invalid (e.g. misspelled) variables.
TEMPLATE_STRING_IF_INVALID = ''



################################################################################
### URL config #################################################################
################################################################################

# Whether to append trailing slashes to URLs.
APPEND_SLASH = True

# Whether to prepend the "www." subdomain to URLs that don't have it.
PREPEND_WWW = False

# List of compiled regular expression objects representing URLs that need not
# be reported by BrokenLinkEmailsMiddleware. Here are a few examples:
#    import re
#    IGNORABLE_404_URLS = (
#        re.compile(r'^/apple-touch-icon.*\.png$'),
#        re.compile(r'^/favicon.ico$),
#        re.compile(r'^/robots.txt$),
#        re.compile(r'^/phpmyadmin/),
#        re.compile(r'\.(cgi|php|pl)$'),
#    )
IGNORABLE_404_URLS = ()

# Default module to use for urls.
ROOT_URLCONF = '<%= siteName %>.urls'



################################################################################
### Static and media files #####################################################
################################################################################

# Absolute filesystem path to the directory that will hold user-uploaded files.
MEDIA_ROOT = os.path.join(PUBLIC_DIR, 'media')

# URL that handles the media served from MEDIA_ROOT.
MEDIA_URL = '/media/'

# Absolute path to the directory static files should be collected to.
STATIC_ROOT = os.path.join(PUBLIC_DIR, 'static')

# URL that handles the static files served from STATIC_ROOT.
STATIC_URL = '/static/'


# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

# A list of locations of additional static files
STATICFILES_DIRS = (
    os.path.join(PUBLIC_DIR, 'dist'),
    os.path.join(PUBLIC_DIR, 'bower_components'),
)



################################################################################
### Logging ####################################################################
################################################################################

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s'
        },
        'simple': {
            'format': '%(levelname)s %(message)s'
        },
    },
    'handlers': {
        'file_requests': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': os.path.join(DATA_DIR, 'logs', 'requests.log'),
            'mode': 'a',
        },
        'file_security': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': os.path.join(DATA_DIR, 'logs', 'security.log'),
            'mode': 'a',
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['file_requests'],
            'level': 'INFO',
            'propagate': False,
        },
        'django.security': {
            'handlers': ['file_security'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}


#################################################################################
#################################################################################
#################################################################################


################################################################################
### App settings ###############################################################
################################################################################


########################
# django.contrib.sites #
########################

# Django Site framework settings.
SITE_ID = 1
