import random

from kivy.event import EventDispatcher
from kivy.properties import NumericProperty

from util import MouseMixin, must_override


class AbstractScale(EventDispatcher):
    weight = NumericProperty(0)

    def is_started(self):
        return False

    def start(self):
        pass
        # startTicker(1, self.read_once)

    def stop(self):
        pass

    def read_once(self):
        must_override("read_once")


class AdamScale(AbstractScale):
    pass


class TimerScale(AbstractScale):
    pass


class BluetoothScale(AbstractScale):
    pass


class MockScale(AbstractScale):

    def read_once(self):
        return random.randint(100, 1000)


class MouseScale(AbstractScale, MouseMixin):

    def start(self):
        super().start()

    def stop(self):
        super().stop()

    def is_started(self):
        return self.is_listening()
        # return super().is_ready()

    def listen(self):
        self.start()
        print("MouseScreen.on_enter() | Started Listening")
        self.listen_start()

    def deafen(self):
        self.stop()
        print("MouseScreen.on_leave() | Stopped Listening")
        self.listen_stop()

    def is_listening(self, state):
        return False

#     def on_enter(self):
#         super().on_enter()
#         print("MouseScreen.on_enter() | Started Listening")
#         self.listen_start()
#
#     def on_leave(self):
#         super().on_leave()
#         print("MouseScreen.on_leave() | Stopped Listening")
#         self.listen_stop()
