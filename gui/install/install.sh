#!/usr/bin/env bash
##!/bin/bash

# in order: setup.sh, update.sh, setup_system.sh

set -e

sudo apt update
sudo apt upgrade
sudo apt-get install -y vim
sudo apt-get install -y python3-venv
sudo apt-get install -y git


#constants
WDIR=/home/pi/evo-track/gui

#pull repo
#ssh-keyscan github.com > ~/.ssh/known_hosts
#[ "$1" == "nogit" ] || git clone git@github.com:evo-eco/evo-track.git


pushd $WDIR || exit 1

  #run other install scripts
  bash install/setup.sh

  bash install/update.sh


popd || exit 1

