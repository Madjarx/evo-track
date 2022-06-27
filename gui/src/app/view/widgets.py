from kivy.properties import ObjectProperty, StringProperty, NumericProperty
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.button import Button
from kivy.uix.widget import WidgetMetaclass

from config import Config
from logger import LoggerMixin


class WasteTypeButton(Button):
    eric = ObjectProperty([1, 1, 1, 0.1])
    category = StringProperty("")

    def on_category(self, key, p):
        self.eric = Config.choices[self.category]["color"]
        self.text = self.category


class ProgressWidget(BoxLayout):
    pass


class MoisheMushy(WidgetMetaclass, LoggerMixin):
    pass

    # def __init__(mcs, name, bases, attrs):
    #     super().__init__(name, bases, attrs)
    #
    # def __mushit(cls, msg):
    #     return cls.__mushit("ObjectWithUid.EventDispatcher.WidgetBase.Widget.Layout.FloatLayout.RelativeLayout.Screen")


class ProgressHeader(ProgressWidget, metaclass=MoisheMushy):
    view = ObjectProperty(None)

    def on_view(self, key, value):
        self.__logger.debug("ProgressHeader.on_view | %s", self.view)


class BoxedLabel(BoxLayout):
    text = StringProperty("")
    font_size = NumericProperty(50)
    size_hint = ObjectProperty([1, 1])
    valign = StringProperty("middle")
    halign = StringProperty("center")
    orientation = StringProperty("vertical")
    text_size: ObjectProperty(None)
    # padding = ObjectProperty(None)
    # padding = ObjectProperty([0, 0, 0, 0])


class BoxedAlertBanner(BoxedLabel):
    alert_text = StringProperty("!")
    # normal_text = StringProperty("")
    # padding = ObjectProperty([10, 10, 10, 0])
    pass
