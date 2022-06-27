#!/usr/bin/env bash
# 
# One-shot run of installing and running package
# 

set -e

source ./app/configs/test.env.sh

PACKAGE_NAME="evo-ingress_0.1.1_armhf.deb"
WATCH_DIR="${EVO_INGRESS_WATCH_PATH:-"/home/pi/queuetest"}"

# build package
echo "( 1 / 5 ) : building package"
dpkg-buildpackage

# install package
echo "( 2 / 5 ) : installing package"
pushd ../

    sudo apt install --reinstall "./$PACKAGE_NAME"

popd 

# start service
echo "( 3 / 5 ) : starting service"
sudo systemctl daemon-reload
sudo systemctl restart evo-ingress@test
sudo systemctl status evo-ingress@test | cat

# start server
echo "( 4 / 5 ) : starting server"
{ echo -e "HTTP/1.1 200 OK\n\n $(date)" | nc -l -p 1500 -q 1 -w 10; } &

# make file to send
echo "( 5 / 5 ) : touching file"
sleep 1
touch "$WATCH_DIR/test-$RANDOM"
sudo systemctl status evo-ingress@test | cat

wait
