import asyncio
import subprocess

from kivy.lang import Builder
from kivy.properties import ObjectProperty, StringProperty, BooleanProperty, NumericProperty
from kivy.uix.screenmanager import Screen

from app.view.widgets import BoxedAlertBanner, MoisheMushy
from util import setTimeout

# region Builder loading screen kv files

# traceback.print_stack()

Builder.load_file("./app/view/screens/0_choice_screen.kv")
Builder.load_file("./app/view/screens/1_ready_screen.kv")
Builder.load_file("./app/view/screens/2_interact_screen.kv")
Builder.load_file("./app/view/screens/3_confirm_screen.kv")
Builder.load_file("./app/view/screens/4_submit_screen.kv")
Builder.load_file("./app/view/screens/5_done_screen.kv")


# endregion


# region Binding between kv and python
# For example, to bind number2 to number1 in python you would do:
#
# class ExampleWidget(Widget):
#     number1 = NumericProperty(None)
#     number2 = NumericProperty(None)
#
#     def __init__(self, **kwargs):
#         super(ExampleWidget, self).__init__(**kwargs)
#         self.bind(number1=self.setter('number2'))
# This is equivalent to kv binding:
#
# <ExampleWidget>:
#     number2: self.number1
# endregion

# region class EvoScreen(Screen)
class EvoScreen(Screen, metaclass=MoisheMushy):
    view = ObjectProperty(None)
    model = ObjectProperty(None)

    def __init__(self, **kw):
        super().__init__(**kw)

    # region Session Lifecycle [ on_enter -> on_session_begin ; on_leave -> on_session_end ]
    def on_enter(self):
        super().on_enter()
        self.__logger.debug("EvoScreen.on_enter() | HACK: self.on_session_begin()")
        self.on_session_begin()

    def on_leave(self):
        super().on_leave()
        self.__logger.debug("EvoScreen.on_leave() | HACK: self.on_session_end()")
        self.on_session_end()

    # region Session Lifecycle (on_session_begin | on_session_end)
    def on_session_begin(self):
        self.__logger.debug("EvoScreen.on_session_begin()")

    def on_session_end(self):
        self.__logger.debug("EvoScreen.on_session_end()")

    # endregion
    # endregion

    def on_parent(self, key, value):
        self.__logger.debug("EvoScreen.on_parent(), %s, %s", self, self.parent)
        if self.parent is not None:
            self.view = self.parent.view
        else:
            pass

    def on_view(self, key, value):
        self.__logger.debug("EvoScreen.on_view | self.view.bind(model=self.on_model), %s", self.view.model)
        self.model = self.view.model
        self.view.bind(model=self._sync_view_model)

    def _sync_view_model(self, key, value):
        self.model = self.view.model

    def on_model(self, key, value):
        self.__logger.debug("EvoScreen.on_model() | %s", self.model)


# endregion


# region class ChoiceScreen(EvoScreen)
class ChoiceScreen(EvoScreen):

    def pressed_choose(self, button, category):
        self.parent.view.controller.choose(category)


# endregion


# region class ReadyScreen(MouseScreen)
class ReadyScreen(EvoScreen):
    absent = BooleanProperty(False)
    present = BooleanProperty(False)
    date_started = ObjectProperty(None)
    weight = NumericProperty(0)
    quantity = NumericProperty(0)

    # region Session Lifecycle (on_session_begin | on_session_end)
    def on_session_begin(self):
        super().on_session_begin()
        self.__logger.debug("ReadyScreen.on_session_begin() | %s %s", self.model, self.weight)
        self.quantity = self.model.quantity + 1
        self.model.weight = self.view.controller.scale.read_once()
        # self.view.controller.scale.bind(weight=self.on_scale_weight)
        # self.model.weight = MockScale.give_weight()
        self.weight = self.model.weight
        self._resync()

    def on_session_end(self):
        super().on_session_end()
        # self.model.total += self.model.weight
        self.weight = 0
        self.model.quantity = self.quantity
        self.quantity = 0
        self._resync()

    # endregion

    def pressed_ready(self):
        self.view.controller.ready()

    def _resync(self):  # TODO: Would be nice to have present/absent self update :0
        # if self.view.controller is not None:
        #     if self.view.controller.model is not None:
        # if self.model is not None:
        if self.weight > 0:
            self.absent = False
            self.present = True
        else:
            self.absent = True
            self.present = False


# endregion


# region class InteractScreen(EvoScreen)
class InteractScreen(EvoScreen):
    weight = NumericProperty(0)
    total = NumericProperty(0)
    quantity = NumericProperty(0)
    units = StringProperty("lbs")
    category = StringProperty("None")

    # region Session Lifecycle
    def on_session_begin(self):
        super().on_session_begin()
        self.__logger.debug("InteractScreen.on_session_begin() | self.weight = %s", self.weight)

        self.category = self.model.category or "None"
        self.units = self.model.units
        self.weight = self.model.weight
        self.total = self.model.total + self.weight
        self.quantity = self.model.quantity + 1

    def on_session_end(self):
        super().on_session_end()
        self.__logger.debug("InspectScreen.on_session_end() | self.weight")
        self.category = "None"
        self.weight = 0

    # endregion

    def pressed_reset(self):
        self.__logger.debug("screens.InteractScreen | reset()")
        self.view.controller.reset()

    def pressed_more(self):
        self.__logger.debug("screens.InteractScreen | more()")
        self.view.controller.interact_again(self.weight)

    def pressed_accept(self):
        self.__logger.debug("screens.InteractScreen | accept()")
        self.view.controller.interact_accept(self.weight)


# endregion


# region class ConfirmScreen(EvoScreen)
class ConfirmScreen(EvoScreen):
    total = NumericProperty(0)
    category = StringProperty("None")

    # region Session Lifecycle (on_session_begin | on_session_end)
    def on_session_begin(self):
        super().on_session_begin()
        self.__logger.debug("ConfirmScreen.on_session_begin() | self.total = %s", self.total)
        self.category = self.model.category or "None"
        self.total = round(self.model.total, 1)

    def on_session_end(self):
        super().on_session_end()
        self.__logger.debug("ConfirmScreen.on_session_end() | self.total")
        self.category = "None"
        self.total = 0

    # endregion

    def pressed_finish(self):
        self.view.controller.confirm_session()

    def pressed_more(self):
        self.view.controller.interact_again(self.model.weight)


# endregion


# region class SubmitScreen(EvoScreen)
class SubmitScreen(EvoScreen):

    # region Session Lifecycle (on_session_begin | on_session_end)
    def on_session_begin(self):
        super().on_session_begin()
        self.__logger.debug("SubmitScreen | on_session_begin()")

    def on_enter(self):
        super().on_enter()
        setTimeout(self.view.controller.config.submit_timeout, self._submit)

    def on_leave(self):
        super().on_leave()
        if self.is_animating():
            self.stop_animating()

    def on_session_end(self):
        super().on_session_end()
        self.__logger.debug("SubmitScreen | on_session_end()")

    # endregion

    def _submit(self):
        asyncio.run(self.submit())

    # def submit(self):
    async def submit(self):
        self.start_animating()
        await self.view.controller.submit()
        self.stop_animating()

    # region Animation
    def start_animating(self):
        self.__logger.debug("SubmitScreen.start_animating() |  NOOP")

    def is_animating(self):
        return True

    def stop_animating(self):
        self.__logger.debug("SubmitScreen.stop_animating() |  NOOP")
    # endregion


# endregion


# region class DoneScreen(EvoScreen)
class DoneScreen(EvoScreen):
    banner_container = ObjectProperty(None)
    check_result_output = None

    def pressed_finish(self):
        self.view.controller.new_session()

    # region checks
    def exec_check(self, name):
        output = subprocess.run("./checks/check-{}.sh".format(name), capture_output=True, text=True)
        return str.rstrip(output.stdout)

    # def check_ping(self):
    #     return self.exec_check("ping")
    #
    # def check_queue(self):
    #     return self.exec_check("queue")
    #
    # def check_service(self):
    #     return self.exec_check("service")

    def on_session_begin(self):
        super().on_session_begin()  # NOTE: This fires when the screen enters, not when session starts

        workload = [
            {"msg": "Check Ping", "name": "ping"},
            {"msg": "Check Service", "name": "service"},
            {"msg": self.exec_check("queue"), "name": "queue"}
        ]

        for grp in workload:
            check_name = grp.get("name")
            self.check_result_output = self.exec_check(check_name)
            print(self.check_result_output)
            if self.should_alert(self.check_result_output):
                if check_name == "queue":
                    self.banner_container.add_widget(
                        BoxedAlertBanner(text="Network Backlog: {}".format(grp.get("msg")))
                    )
                else:
                    self.banner_container.add_widget(
                        BoxedAlertBanner(text="{}".format(grp.get("msg")))
                    )

    def should_alert(self, check_result_output):
        if check_result_output != "up" and check_result_output != "0":
            return True
        else:
            return False
    # endregion

# endregion
