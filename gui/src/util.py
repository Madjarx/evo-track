import asyncio
import re
from threading import Timer

from kivy.core.window import Window
from kivy.properties import ObjectProperty


def setTimeout(delay, callback):
    Timer(delay, callback).start()


def startTicker(interval, callback):  # TODO: Figure out how to make a timer that can be cancelled
    setTimeout(interval * 1, callback)
    setTimeout(interval * 2, callback)
    setTimeout(interval * 3, callback)
    setTimeout(interval * 4, callback)
    setTimeout(interval * 5, callback)


async def set_after(fut, delay, value):
    # Sleep for *delay* seconds.
    await asyncio.sleep(delay)

    # Set *value* as a result of *fut* Future.
    fut.set_result(value)


async def done_after(delay, value):  # TODO: Figure out futures
    # Get the current event loop.
    loop = asyncio.get_running_loop()
    # Create a new Future object.
    fut = loop.create_future()
    await set_after(fut, delay, value)


def later(callback):
    setTimeout(1, callback)


def check_number_positive(weight):
    if weight <= 0:
        raise ValueError("Not a positive number" + str(weight))


class MouseMixin:
    mouse_pos = ObjectProperty(None)

    def listen_start(self):
        Window.bind(mouse_pos=self.on_mouse_pos)

    def listen_stop(self):
        Window.unbind(mouse_pos=self.on_mouse_pos)

    def on_mouse_pos(self, pos, value):
        pass


def remove_prefix(text, prefix):
    if text.startswith(prefix):
        return text[len(prefix):]
    return text  # or whatever


def remove_prefix2(text, prefix):
    return re.sub(prefix, "", text)


def must_override(thing=None):
    raise ValueError("must override ", thing)


def crash(thing=None):
    raise ValueError("crashed ", thing)
