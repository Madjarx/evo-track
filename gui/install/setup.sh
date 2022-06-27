#!/bin/bash

#constants
ENV=venv

sudo apt install python3-venv

#create and go into venv
if [ -d "./$ENV" ]
then
    echo "VENV exists."
else
    python3 -m venv --system-site-packages $ENV
    echo "CREATED $ENV virtual env."
fi

#get pi-hello-video repo and build come c stuff
if [ -f /sys/firmware/devicetree/base/model ]
then
  sudo apt-get install gstreamer1.0-omx
#  git clone https://github.com/dbgasaway/pi_hello_video.git
  git clone git@github.com:adafruit/pi_hello_video.git
  pushd pi_hello_video
  ./rebuild.sh
  popd
fi

#libs for kivy
sudo apt-get install -y libsdl2-dev libsdl2-image-dev libsdl2-mixer-dev libsdl2-ttf-dev
sudo apt-get install -y pkg-config libgl1-mesa-dev libgles2-mesa-dev
sudo apt-get install -y python-setuptools libgstreamer1.0-dev git-core
sudo apt-get install -y gstreamer1.0-plugins-{bad,base,good,ugly}
sudo apt-get install -y gstreamer1.0-alsa python-dev
sudo apt-get install -y python3-dbus
#libs for cryptography
sudo apt install -y build-essential libssl-dev libffi-dev python-dev

