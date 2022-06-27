from kivy.app import App

from app.controller.controller import Controller
from app.scale.scales import MockScale
from app.view.view import View
from config import Config, YamlConfigLoader, ConfigValidator
from ingress.connections import IngressConnectionFactory, JSONDiskIngressConnection
from ingress.ingress import Ingress


class MainApp(App):
    view = None

    def on_start(self):
        self.view.start()  # NOTE: This is before the view has been created.

    def build(self):
        config = self.read_config()
        controller = self.create_controller(config)
        self.view = self.create_view(controller)
        return self.view

    # region create_[ config | ingress | controller | view ]
    def read_config(self):
        return ConfigValidator.validate(YamlConfigLoader().load_from_path("config.yaml"))
        # return YamlConfigLoader("./").load_from_path("config.yaml")
        # return Config()

    def create_ingress(self, config):
        # factory = JSONDiskIngressConnection(ingress_uri=config.ingress_uri)
        factory = IngressConnectionFactory(ingress_uri=config.ingress_uri)
        conn = factory.create()
        return Ingress(conn=conn)

    def create_controller(self, config):
        ingress = self.create_ingress(config=config)
        scale = self.create_scale(config=config)
        return Controller(config=config, ingress=ingress, scale=scale)

    def create_view(self, controller):
        return View(controller=controller)

    def create_scale(self, config):  # NOTE: We intend to use config param
        return MockScale()  # TODO: Figure out what config scales might need
        # return MockScale(config=config)  # TODO: Figure out what config scales might need

    # endregion
