from kivy.lang import Builder
from kivy.properties import ObjectProperty, StringProperty, ColorProperty
from kivy.uix.label import Label
from kivy.uix.screenmanager import ScreenManager
from kivy.uix.widget import Widget

from app.view.screens.screens import EvoScreen
from app.view.screens.screens_helpers import CurrentScreenAware
from app.view.widgets import MoisheMushy

Builder.load_file("./app/view/view.kv")


class View(Widget, metaclass=MoisheMushy):
    # region properties [config, model, controller, screens]
    model = ObjectProperty(None)
    controller = ObjectProperty(None)

    # region screens [screen_manager: choice, ready, interact, accept, submit, done]
    screen_manager = ObjectProperty(ScreenManager)

    choice_screen = ObjectProperty(None)
    ready_screen = ObjectProperty(None)
    interact_screen = ObjectProperty(None)
    accept_screen = ObjectProperty(None)
    submit_screen = ObjectProperty(None)
    done_screen = ObjectProperty(None)
    # endregion

    _IGNORE_ME_ = EvoScreen()  # NOTE: This protects us from IntelliJ automatically removing an unused import

    # endregion

    def __init__(self, controller, **kwargs):
        super().__init__(**kwargs)
        self.controller = controller
        # self.controller.bind(model=self._sync_controller_model)

    def start(self):  # NOTE: Called by app.py
        self.__logger.lifecycle("View.start | self.controller.start()")
        self.controller.start()

    def on_controller(self, key, value):
        self.__logger.debug("View.on_controller | self.controller.bind(model=self.on_model)")
        self.controller.bind(model=self._sync_controller_model)

    def _sync_controller_model(self, key, value):
        self.__logger.debug("View.on_model | self.model = self.controller.model")
        self.model = self.controller.model  # TODO: View screen can't access/react to view.model????

    def on_model(self, key, value):
        self.model.bind(screen=self._sync_model_screen)

    def _sync_model_screen(self, key, value):
        # WARNING: Better to use switch_to() because doesn't leave dangling direction change
        # self.screen_manager.transition.direction = "left"
        # self.view.screen_manager.transition.direction = direction
        self.screen_manager.current = self.model.screen


# region ScreenNub(Label, CurrentScreenAware)

class ScreenNub(Label, CurrentScreenAware):
    screen = StringProperty(None)
    circle_color = ColorProperty(None)

    text_active = "@"
    text_inactive = ""

    def refresh(self):
        if self.current == self.screen:
            self.text = self.text_active
            self.circle_color = [0, 1, 0, 1]
        else:
            self.text = self.text_inactive
            self.circle_color = [1, 1, 1, 1]

    def on_screen(self, key, value):
        self.refresh()

    def on_current(self, key, value):
        super().on_current(key, value)
        self.refresh()

# endregion

