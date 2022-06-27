# https://stackoverflow.com/questions/36106353/using-python-logging-when-logging-root-has-been-redefined-kivy
import logging
import datetime

from kivy.logger import Logger, LOG_LEVELS, formatter_message, ColoredFormatter

from util import remove_prefix2

logging.basicConfig(
    datefmt='%Y'
)

logging.Logger.manager.root = Logger
Logger.setLevel(LOG_LEVELS["debug"])

# TODO: Why does the change happen after the kivy logs a different way?
# TODO: How do we augment instead of replace the handler?
# TODO: Are there alternatives? (ie. we can probably get what we want by modifying what Eric modified)
# formatter = logging.Formatter("[%(levelname)-7s] - [%(asctime)s] - %(message)s")
formatter = ColoredFormatter("%(asctime)s [%(levelname)-18s] %(message)s")
# formatter = logging.Formatter("[%(levelname)-8s] - %(name)-20s - %(message)s")


for handler in Logger.handlers:
    handler.setFormatter(formatter)

# logger = logging.getLogger("MyApp")
# logger.setLevel(logging.DEBUG)
#
# # remove all default handlers
# for handler in logger.handlers:
#     logger.removeHandler(handler)
#
# # create console handler and set level to debug
# console_handle = logging.StreamHandler()
# console_handle.setLevel(logging.DEBUG)
#
# # create formatter
# formatter = logging.Formatter("%(name)-20s - %(levelname)-8s - %(message)s")
# console_handle.setFormatter(formatter)
#
# # now add new handler to logger
# logger.addHandler(console_handle)

# logging.basicConfig(
#     format='%(asctime)s %(levelname)-8s %(message)s',
#     level=logging.INFO,
#     datefmt='%Y-%m-%d %H:%M:%S')




# def logger_config_update(section, key, value):
#     if LOG_LEVELS.get(value) is None:
#         raise AttributeError('Loglevel {0!r} doesn\'t exists'.format(value))
#     Logger.setLevel(level=LOG_LEVELS.get(value))

# TODO: Implement logging as a "metaclass" - see: https://stackoverflow.com/questions/29069655/python-logging-with-a-common-logger-class-mixin-and-class-inheritance


class LoggerMixin2:

    def __init__(self, actor=None, **kwargs):
        super().__init__(**kwargs)
        if actor is None:
            print("WARNING: use: actor=__class__.__name__")
        # NOTE: self.logger = logging.getLogger().getChild(__name__)
        self.logger = InstanceLogger(actor=actor or __class__.__name__)
        print("self.logger = logging.getLogger().getChild(__name__) | __name__ = ", __name__)


class LoggerMixin(type):
    mushables = [
        "^.+?(\.Screen)",
        "^.+?(\.EventDispatcher)",
        "^.+?(\.Widget)"
    ]

    # mushables = ["ObjectWithUid.EventDispatcher.WidgetBase.Widget.Layout.FloatLayout.RelativeLayout.Screen"]

    def __init__(cls, *args):
        super().__init__(*args)
        now = datetime.datetime.now()

        # Explicit name mangling
        logger_attribute_name = '_' + cls.__name__ + '__logger'

        # Logger name derived accounting for inheritance for the bonus marks
        logger_name = '.'.join([c.__name__ for c in cls.mro()[-2::-1]])

        logger_name = cls.__mushit(logger_name)

        setattr(cls, logger_attribute_name, InstanceLogger(actor=logger_name))
        # setattr(cls, logger_attribute_name, logging.getLogger(logger_name))

    def __mushit(cls, msg):
        for mushable in LoggerMixin.mushables:
            msg = remove_prefix2(msg, mushable)
        return msg
        # return remove_prefix(msg, "ObjectWithUid.EventDispatcher")


class InstanceLogger:
    impl = None

    # impl = Logger
    def __init__(self, actor):
        super().__init__()
        self.actor = actor
        # self.impl = logging.getLogger()
        self.impl = logging.getLogger().getChild(actor or __name__)
        # self.impl = logging.getLogger().getChild("A").getChild("B")
        self.impl.setLevel(LOG_LEVELS["debug"])

    def munge(self, msg):
        return self.actor + " " + msg

    # region Framework Logging
    def lifecycle(self, msg, *args, **kwargs):
        # self.info("A: " + msg, *args, **kwargs)
        self.info(msg, *args, **kwargs)

    # endregion

    def print(self, msg, *args, **kwargs):
        print(self.munge(msg), *args, **kwargs)

    def alarm(self, msg, *args, **kwargs):
        self.impl.critical(self.munge(msg), *args, **kwargs)

    # region Standard
    def error(self, msg, *args, **kwargs):
        self.impl.error(self.munge(msg), *args, **kwargs)

    def warn(self, msg, *args, **kwargs):
        self.impl.warning(self.munge(msg), *args, **kwargs)

    def trace(self, msg, *args, **kwargs):
        self.impl.warning(self.munge(msg), *args, **kwargs)  # Note: No trace() method in kivy??

    def debug(self, msg, *args, **kwargs):
        self.impl.debug(self.munge(msg), *args, **kwargs)
        # self.impl.info(self.munge(msg))
        # self.impl.info(self.munge(msg), *args, **kwargs)
        # self.print(msg, *args, **kwargs)

    def info(self, msg, *args, **kwargs):
        self.impl.info(self.munge(msg), *args, **kwargs)  # TODO: Make each method this way
    # endregion
