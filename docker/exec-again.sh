#!/bin/bash

set -e

SERVICE=${1}
# SERVICE=${1:-influxdb}
VOLUMES="./docker-volumes"

function run() {
    workaround

    down

    docker_wipe || true

    volume_wipe || true

    up
}

function wipe () {
    docker container rm --force $(docker ps -a -q) || true
    docker volume rm --force $(docker volume ls -q) || true
}

function workaround() {
    # workaround for docker-compose windows "file not found" bug
    pushd ..
        docker-compose ps
    popd
}

function down() {
    docker-compose down --remove-orphans
}

function volume_wipe() {
    # rm -rf ./influxdb-storage
    rm -rf "${VOLUMES}"
}

function up() {
    if [[ -z "$SERVICE" ]]; then
        docker-compose up  "$SERVICE"
    else
        docker-compose up
    fi
}

run
