#!/usr/bin/env bash

# PARAMS:
# 	1: name of child instance of service 

#CONFIG_FILE="/etc/evo-ingress/$1.env.sh"
CONFIG_FILE="/etc/evo-ingress/$1.json"

test -f "$CONFIG_FILE" || ( echo "$CONFIG_FILE does not exist" && exit 1 )

#source "$CONFIG_FILE"
EVO_INGRESS_WATCH_PATH=$(jq -r ".EVO_INGRESS_WATCH_PATH" "$CONFIG_FILE")
test -z "${EVO_INGRESS_WATCH_PATH}" && ( echo "EVO_INGRESS_WATCH_PATH not set in config" && exit 1 )


find "${EVO_INGRESS_WATCH_PATH}" -type f | xargs -Ifile /lib/evoeco/evo-ingress/bin/exec-ingress.sh file "$CONFIG_FILE"
