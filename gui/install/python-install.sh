#!/bin/bash

WDIR=/home/pi/evo-track/gui


pushd $WDIR || exit 1

	source venv-activate.sh

  sudo apt-get update
  sudo apt-get upgrade
	pip3 install --upgrade pip
	pip3 install wheel
	pip3 install --upgrade setuptools

	# Cython 0.29.10 is the latest currently supported,
	# and is an unlisted dependency of kivy
	pip3 install --upgrade Cython==0.29.10

	#use 1.10 for prod. use 1.11 for VNC & development (`export DISPLAY=:0`)
	#pip3 install --no-binary ":all:" kivy==1.10.1
	pip3 install kivy==1.11.0

	pip3 install --upgrade -r requirements.txt

	#copy kivy config to home directory
	if [ -e ~/.kivy/config.ini ]
	then
	    echo "KIVY CONFIG.INI EXISTS"
	else
	    cp $WDIR/install/config.ini ~/.kivy/
	fi


popd || exit 1

