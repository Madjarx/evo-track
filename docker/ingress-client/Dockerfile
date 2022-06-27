FROM jrei/systemd-ubuntu

RUN apt-get update && apt-get install -y \
    software-properties-common

RUN add-apt-repository universe

RUN apt-get update && apt-get install -y \
    python3-pip
RUN pip3 install watchdog
