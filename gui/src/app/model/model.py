# IT WOULD BE DELICIOUS TO HAVE MODEL DEFINED AS DEFAULT EXPORT, SO WE NEVER HAVE TO TYPE model.model :P
# BECAUSE THAT IS CONFUSING AND UGLY TO EVERYONE ACCORDING TO MICHAEL
from kivy.event import EventDispatcher
from kivy.properties import StringProperty, NumericProperty


# NOTE: Kivy properties require this superclass
class Model(EventDispatcher):
    date_started = None
    date_finished = None

    screen = StringProperty(None)
    screen_transition_direction = StringProperty(None)

    #####################################################################################
    category = StringProperty(None)

    quantity = NumericProperty(0)

    total = NumericProperty(0)

    weight = NumericProperty(0)
    units = StringProperty("lbs")
    #####################################################################################

    # def persist(self):
    #     model = DiskModel()
    #
    #     model.date_started = self.date_started
    #     model.date_finished = self.date_started
    #     model.weight = self.weight
    #     model.category = self.category
    #     model.quantity = self.quantity
    #     model.total = self.total
    #
    #     return {}
    #     # return model

    def persist(self):
        return {
            "date_started": self.date_started,
            "date_finished": self.date_finished,
            "category": self.category,
            "quantity": self.quantity,
            "units": self.units,
            "total": self.total
        }

        # return result  # TODO: Add our properties to dictionary
        # return {}  # TODO: Add our properties to dictionary


class DiskModel:
    date_started = None
    date_finished = None

    category = None

    quantity = 0

    units = "lbs"

    total = 0
