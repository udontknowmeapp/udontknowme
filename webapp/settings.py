import os


class ImproperlyConfigured(Exception):
    """
    Exception to raise when the environment to run the server hasn't been
    configured properly.
    """

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(__file__)


#our helper function that makes it easy to get env vars or raise an error
def get_env_variable(var_name, required=True,
                     is_int=False, is_boolean=False, default=None):
    """ Get the environment variable or return exception """
    try:
        env_var = os.environ[var_name]
        if is_int:
            try:
                return int(env_var)
            except ValueError:
                error_msg = "%s environment variable must be a number" % var_name
                raise ImproperlyConfigured(error_msg)
        elif is_boolean:
            if env_var == "TRUE":
                return True
            else:
                return False
        else:
            return env_var
    except KeyError:
        if required:
            error_msg = "Set the %s environment variable" % var_name
            raise ImproperlyConfigured(error_msg)
        else:
            return default


DEBUG = get_env_variable(
    'DEBUG',
    required=False,
    is_boolean=True,
    default=True
)

PORT = get_env_variable(
    'PORT',
    required=False,
    is_int=True,
    default=8000
)

WEB_TEMPLATE_PATH = get_env_variable(
    'WEB_TEMPLATE_PATH',
    required=False,
    default=os.path.join(BASE_DIR, '../frontend/build/')
)

WEB_STATIC_PATH = get_env_variable(
    'WEB_ASSETS_PATH',
    required=False,
    default=os.path.join(BASE_DIR, '../frontend/build/assets/')
)
