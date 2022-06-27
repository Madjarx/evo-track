from logger import LoggerMixin


class Debug(metaclass=LoggerMixin):
    ###############################
    make_default_choice = False
    # make_default_choice = True

    # default_choice = None
    default_choice = "COMPOST"

    ###############################

    def on_start(self, controller):
        self.__logger.debug("Debug.on_start() | controller = %s", controller)
        pass

    # def on_accept(self):
    def on_new_session(self, controller, model):
        self.__logger.debug("Debug.on_new_session() | controller = %s, model = %s", controller, model)
        # [ CHOICE ] ##################
        if Debug.make_default_choice:
            print("model.category = ", self.default_choice)
            model.category = self.default_choice
            # controller.choose(self.choice or input("Type type of waste: "))
            # model.choice = self.choice or input("Type type of waste: ")

        # if Config.WEIGHT_OVERRIDE:
        #     model.weight = Config.WEIGHT_OVERRIDE
        ###############################

        # NOTE: Every other hack to make UI development easier, GOES HERE

        # if Dev.make_default_choice:
        #     model.choice = self.choice or input("Type type of waste: ")

        return model
