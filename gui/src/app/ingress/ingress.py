from logger import LoggerMixin


# This file saves our model to the cloud
class Ingress(metaclass=LoggerMixin):
    conn = None

    def __init__(self, conn) -> None:
        super().__init__()
        self.conn = conn

    async def enqueue(self, model):
        self.__logger.lifecycle("Ingress.enqueue() | model = %s", model)
        # self.conn.save(model)
        await self.conn.save(model)
