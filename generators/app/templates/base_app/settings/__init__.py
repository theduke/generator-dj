import os

ENV = os.environ.get('ENV', 'production')

if ENV == 'prod':
    from .prod import *
elif ENV == 'staging':
    from .staging import *
elif ENV == 'dev':
    from .dev import *
