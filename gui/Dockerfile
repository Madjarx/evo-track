
FROM balenalib/raspberry-pi-debian:buster

RUN apt-get update && apt-get install -yq --no-install-recommends \
    gcc libraspberrypi-dev libraspberrypi-bin libsdl2-dev libsdl2-image-dev libsdl2-mixer-dev libsdl2-ttf-dev \
    pkg-config libgl1-mesa-dev libgles2-mesa-dev mtdev-tools\
    python-pygame python-setuptools libgstreamer1.0-dev git-core \
    gstreamer1.0-plugins-base gstreamer1.0-plugins-good gstreamer1.0-plugins-bad gstreamer1.0-plugins-ugly \
    gstreamer1.0-alsa gstreamer1.0-omx python3-dev python3 curl && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# create src dir
RUN mkdir -p /usr/src/app/
ENV KIVY_HOME=/usr/src/app
# set as WORKDIR
WORKDIR /usr/src/app
#COPY config.ini config.ini

RUN curl https://bootstrap.pypa.io/get-pip.py | python3

##RUN pip install pygments docutils wheel && pip install pgen
#RUN pip3 install wheel && pip3 install pgen && pip3 install -I Cython==0.28.2 && rm -Rf /root/.cache/*
RUN pip3 install wheel && pip3 install pgen && pip3 install -I Cython==0.29.10 && rm -Rf /root/.cache/*

RUN pip3 install paho-mqtt

RUN git clone -b 1.10.1 --depth 1 https://github.com/kivy/kivy \
     && cd kivy && python3 setup.py build && python3 setup.py install && cd .. && rm -Rf kivy

# Copy my application files
RUN mkdir -p apps
ADD . /home/pi/evo-track/gui
#COPY ./apps/ ./apps/

# runs a sample app on container start
CMD ["python3", "/home/pi/evo-track/gui/src/main.py"]
#CMD ["python3", "/home/pi/evo-track/gui/app/main.py"]