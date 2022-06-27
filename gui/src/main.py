from app.app import MainApp
from kivy.core.window import Window
# import pydevd_pycharm
# pydevd_pycharm.settrace('192.168.1.139', port=22, stdoutToServer=True, stderrToServer=True)


if __name__ == '__main__':
    Window.fullscreen = True
    # Config.set('graphics', 'fullscreen', 'auto')
    # Config.set('graphics', 'rotation', 90)
    MainApp().run()
