import asyncio
import json
import copy
import time

# This file is used in conjunction with ingress.py
from app.view.widgets import MoisheMushy
from util import done_after


# region IngressConnectionFactory [ Mock ]
class IngressConnectionFactory(metaclass=MoisheMushy):
    ingress_uri = None

    def __init__(self, ingress_uri) -> None:
        super().__init__()
        self.ingress_uri = ingress_uri

    def create(self):
        self.__logger.debug("IngressConnectionFactory.create() | ingress_uri = %s", self.ingress_uri)
        # print("IngressConnectionFactory.create() | ingress_uri = ", ingress_uri)
        # return MockIngressConnection()
        return JSONDiskIngressConnection(self.ingress_uri)


# endregion


class IngressConnection:

    async def save(self, model):
        raise SystemError("Not Implemented :(")


# region class MockIngressConnection(IngressConnection)
class MockIngressConnection(IngressConnection, metaclass=MoisheMushy):

    async def save(self, model):
        self.__logger.debug("MockIngressConnection.save() | model = %s", model)
        # return done_after(2, "saved")
        return asyncio.ensure_future(done_after(2, "saved"))
        # return set_after(2, 1, True)


# endregion


# region class DiskIngressConnection(MockIngressConnection)
class DiskIngressConnection(MockIngressConnection):
    pass


# endregion


# region class JSONDiskIngressConnection(DiskIngressConnection)
class JSONDiskIngressConnection(DiskIngressConnection):

    def __init__(self, ingress_uri):
        super().__init__()
        self.ingress_uri = ingress_uri

    async def save(self, model):
        # super().save(model)  # NOTE: API REQUIRES A SINGLE IMPLEMENTATION
        # see: https://stackabuse.com/saving-text-json-and-csv-to-a-file-in-python/

        get_nonce = lambda: int(round(time.time() * 1000))

        filename = "0000-00-00"  # TODO: Eric to figure out how to put current date in that format
        nonce = get_nonce()
        nonce = int(round(time.time() * 1000))

        with open("{}/{}.{}.json".format(
                self.ingress_uri,
                filename,
                nonce
                ), "w+") as file:
            json.dump(copy.copy(model.persist()), file)
            file.write("\n")
# endregion
