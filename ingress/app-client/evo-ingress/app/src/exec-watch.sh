#!/usr/bin/env bash

# PARAMS:
# 	1: name of child instance of service 

# ingress all files already in the folder
/lib/evoeco/evo-ingress/bin/start-ingress.sh "$1"

#CONFIG_FILE="/etc/evo-ingress/$1.env.sh"
CONFIG_FILE="/etc/evo-ingress/$1.json"
test -f "$CONFIG_FILE" || ( echo "$CONFIG_FILE does not exist" && exit 1 )
#source "$CONFIG_FILE"

EVO_INGRESS_WATCH_PATH=$(jq -r ".EVO_INGRESS_WATCH_PATH" "$CONFIG_FILE")
test -z "${EVO_INGRESS_WATCH_PATH}" && ( echo "EVO_INGRESS_WATCH_PATH not set in config" && exit 1 )

echo "evo-ingress: $1 (start)"

# NOTES: 
# command HAS to be wrapped in single quotes
# watch path HAS to be absolute
# watch path is preappended to the watch_src_path (the file name)
# --wait and --drop ensure that we only run our command once
# --debug-force-polling avoids reporting a "modification" event, thereby running our script fewer times
/opt/venvs/evo-ingress/bin/watchmedo shell-command \
	--recursive \
	--wait \
	--drop \
	--debug-force-polling \
	--command '/lib/evoeco/evo-ingress/bin/exec-ingress.sh "${watch_src_path}" '"$CONFIG_FILE"'' \
	"${EVO_INGRESS_WATCH_PATH}"
 
echo "evo-ingress: $1 (stop)"


