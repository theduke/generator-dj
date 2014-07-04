#!/usr/bin/env python
import os
import sys

if __name__ == "__main__":
    # Make it possible to run from any directory.
    DIR = os.path.dirname(os.path.realpath(__file__))

    # Add apps and lib dir to settings.
    sys.path.append(os.path.join(DIR, 'apps'))
    sys.path.append(os.path.join(DIR, 'lib'))
    
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "<%= siteName %>.settings")

    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)
