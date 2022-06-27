import datetime

from kivy.event import EventDispatcher
from kivy.properties import ObjectProperty
from model.model import Model

from debug import Debug
from logger import LoggerMixin
from util import later


# from app.view.screens.screens import MoisheMushy

# self.logger = config.get_logger(self, __name__)


class Controller(EventDispatcher, metaclass=LoggerMixin):
    config = None

    ingress = ObjectProperty(None)
    scale = ObjectProperty(None)
    model = ObjectProperty(None)

    def __init__(self, config, ingress, scale, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # super().__init__(*args, actor=__class__.__name__, **kwargs)
        self.config = config
        self.ingress = ingress
        self.scale = scale
        self.logger = self.__logger

    # region start
    def start(self):
        later(self.new_session)
        # later(self.on_start)

    # def on_start(self):
    #     self.idle()  # The reason for on_start was to differentiate between the first run and subsequent runs
    #     # self.idle(on_start=True)
    # endregion

    # region idle
    def new_session(self, **kwargs):
        self.__logger.lifecycle("Controller.new_session | self.model = Model()")
        self.model = Model()

        #############################################################
        # if kwargs["on_start"] is True:
        Debug().on_new_session(self, self.model)  # NEED TO FIGURE OUT WHAT "Debug" MEANS
        #############################################################

        # TODO: PROPS NEEDED FOR MOCKING DON'T GO IN THE MODEL? THEN WHAT?
        if self.model.category is not None:
            self.choose(self.model.category)
        else:
            self.navigate("done", **kwargs)

    # endregion

    # region choose
    def choose(self, category):
        if self.config.choices[category] is None:
            raise ValueError("Invalid Choice: ", category)
        if self.model.category is not None:
            raise ValueError("Cannot make a second choice")

        self.model.date_started = datetime.datetime.now().isoformat()

        self.model.category = category
        self.navigate("ready")

    # endregion

    # region ready
    def ready(self):
        self.__logger.debug("Controller.ready() | self.model.weight = %s", self.model.weight)
        self.navigate("interact")

    # endregion

    # def mock_scale(self):
    #     value = Random.randint(0, 1000)  # TODO: Figure out what makes sense
    #     self.model.weight = round(float(value[0]) / 1000)

    # region interact_accept / interact_again
    def interact_accept(self, weight):
        self.model.total += weight
        self.model.weight = 0
        self.navigate("confirm")

    """
    Called when the user wants to "add one more"
    Called from ConfirmScreen and InteractScreen
    """

    def interact_again(self, weight):
        self.model.total += weight
        self.model.weight = 0
        self.navigate("ready")

    # endregion

    # region finish
    def confirm_session(self):
        # self.conn.save(self.model)
        today = datetime.datetime.now()
        self.model.date_finished = today.isoformat()
        # self.model.date_finished = today.strftime("%Y-%m-%d %H:%M:%S")
        self.navigate("submit")

    # endregion

    # region submitted
    async def submit(self):
        self.model.date_ingress = datetime.datetime.now()
        await self.ingress.enqueue(self.model)
        self._on_submitted()

    def _on_submitted(self):
        self.navigate("done")  # TODO: Would be nice to announce in a way that the screen could "hear"

    # endregion

    # region reset [ when the user wants to go back to idle, and completely start over (i.e. choose a diff category) ]
    def reset(self):
        self.new_session(direction='right')  # "idle" will handle model management

    # endregion

    # region navigate
    def navigate(self, screen, direction='left'):
        self.__logger.lifecycle("Going to Screen: " + screen)
        # self.logger.lifecycle("Going to Screen: " + screen)
        # self.__logger.lifecycle("Going to Screen: " + screen)
        self.model.screen_transition_direction = direction
        self.model.screen = screen  # WARNING: UNCERTAIN OF ORDER OF OPERATIONS NEEDED
        # TODO: This is a good place to do synchronized cleanup or events or sounds
    # endregion
