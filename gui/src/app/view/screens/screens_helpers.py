from kivy.properties import ObjectProperty, StringProperty

from app.view.widgets import MoisheMushy


# from util import MouseMixin


# class MouseScreen(EvoScreen, MouseMixin):
#
#     def on_enter(self):
#         super().on_enter()
#         print("MouseScreen.on_enter() | Started Listening")
#         self.listen_start()
#
#     def on_leave(self):
#         super().on_leave()
#         print("MouseScreen.on_leave() | Stopped Listening")
#         self.listen_stop()


class ParentViewAware(metaclass=MoisheMushy):
    view = ObjectProperty(None)

    def on_view(self, key, value):
        self.__logger.debug("ViewAware.on_view() | self.view = %s, %s, %s", self.view, key, value)
        self.view = value
        # self.view.screen_manager.bind(current=self.on_current)

    def on_parent(self, key, value):
        self.__logger.debug("ViewAware.on_parent() | self.parent = self.parent.view, %s, %s", self.parent,
                            self.parent.view)
        self.view = self.parent.view
        self.parent.bind(view=self.on_view)


class CurrentScreenAware(ParentViewAware):
    current = StringProperty("?")

    def on_view(self, key, value):
        # super(CurrentScreenAware, self).on_view(key, value)  # TODO: WE STOPPED HERE: I HAVE NO IDEA.
        self.view = value
        self.view.screen_manager.bind(current=self.on_current)
        self.current = self.view.screen_manager.current

    def on_current(self, key, value):
        self.current = value
