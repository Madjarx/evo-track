# This file will "own" all customizations/implementations/choices (aka: where to ingress and what options on the screen)
from logger import InstanceLogger
import yaml

from util import crash, must_override

# with open('tree.yaml') as f:
#     # use safe_load instead load
#     dataMap = yaml.safe_load(f)


class ConfigValidator:

    @staticmethod
    def validate(config):
        import os
        os.stat(config.ingress_uri)
        return config


class ConfigLoader:

    def file_to_dict(self, file):
        must_override()
        return {}

    def dict_to_config(self, d):
        config = Config()
        config.ingress_uri = d["ingress_uri"] or "DEFAULT_VALUE_HERE"
        return config

    def load_from_path(self, path):
        with open(path) as f:
            d = self.file_to_dict(f)
            # print(str(d))
            # print(str(d["config"]))
            # print(str(d["config"]["ingress_uri"]))
            # print(str(d.config))
            return self.dict_to_config(d["config"])


class YamlConfigLoader(ConfigLoader):

    def file_to_dict(self, file):
        return yaml.full_load(file)


class Config:
    # connection = LoadConnection()

    logger = InstanceLogger(actor="evo-track")

    ingress_uri = "file:json:/var/log/evoeco/ingress"
    # ingress = "json:/var/log/evoeco/ingress"

    choices = {
        "COMPOST": {
            "color": [0, 0.3, 0, 1]
        },
        "RECYCLE": {
            "color": [0, 0, 1, 1]
        },
        "LANDFILL": {
            "color": [1, 0, 0, 1]
        },
        "BOTTLES": {
            "color": [218.0 / 255, 35.0 / 255, 251.0 / 255, 0.6]
        },
        "PAPER": {
            "color": [0, 0, 0, 1]
        }
    }  # TODO: Move to central config (Not a per-session concern)

    submit_timeout = 2
    # def get_logger(self, actor, name):
    #     print("WE WERE SUPPOSED TO CREATE A LOGGER, AND DIDN'T :)))")
    #     # return logging.getLogger().getChild(__name__)
    #     return InstanceLogger(actor, name)
