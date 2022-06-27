##!/usr/bin/env bash

set -e

pushd "${0%/*}"

#nvm use 14
#
#npm i -g nodemon

#pushd "~/evo-track/src/"

source venv-activate.sh
#source ~/evo-track/gui/venv-activate.sh
export DISPLAY=:0.0
export PATH="$PATH:$(yarn global bin)"
nodemon --ignore "venv" --exec "clear && echo '----------------' && . ~/.profile  && python3 src/main.py" --ext "py kv txt yaml yml sh" --delay 1