#!/bin/bash

# PARAMS:
#	1: new file
#	2: config file

TARGET_FILE_ABS="$1"
CONFIG_FILE="$2"

#source "$CONFIG_FILE"

# if we have been given a directory/non-existent file, exit
test -f "$TARGET_FILE_ABS" || exit 1 


#URL="${EVO_INGRESS_URL}"
#EVOECO_AUTH="${EVO_INGRESS_AUTH}"
#CONNECTION_TIMEOUT="${EVO_INGRESS_CONN_TIMEOUT:-10}"

URL=$(jq -r ".EVO_INGRESS_URL" "$CONFIG_FILE")
EVOECO_AUTH=$(jq -r ".EVO_INGRESS_AUTH" "$CONFIG_FILE")
CRT_PATH=$(jq -r ".EVO_INGRESS_CRT_PATH" "$CONFIG_FILE")
KEY_PATH=$(jq -r ".EVO_INGRESS_KEY_PATH" "$CONFIG_FILE")
HEADERS_PATH=$(jq -r ".EVO_INGRESS_HEADERS_PATH" "$CONFIG_FILE")
CONNECTION_TIMEOUT=$(jq -r ".EVO_INGRESS_CONN_TIMEOUT" "$CONFIG_FILE")
# TOKEN=$(cat "$(jq -r ".EVO_INGRESS_TOKEN_PATH" "$CONFIG_FILE")") # TODO: create new token every time
echo $HEADERS_PATH
TOKEN=$(python3 /lib/evoeco/evo-ingress/bin/gen-jwt.py $HEADERS_PATH $KEY_PATH -c $CRT_PATH)

test -z "${URL}" && ( echo "EVO_INGRESS_URL not set in config" && exit 1 )
test -z "${TOKEN}" && ( echo "TOKEN could not be created from config" && exit 1 )

echo
echo "locking and uploading: $TARGET_FILE_ABS"

# http://manpages.ubuntu.com/manpages/xenial/man1/flock.1.html	see "Examples" section
(
	flock -n 9 || exit 1
	
	# https://stackoverflow.com/a/7173011/14362052
	# use --data-binary to send file with new lines
	# more than one file may be submitted, but the same key needs to be used. each file needs an additional `--form "data=@..."`
	curl "$URL" \
		--request POST \
		--fail \
		--header "Content-Type: multipart/form-data" \
		--header "Authorization: $TOKEN" \
		--form "data=@$TARGET_FILE_ABS" \
		--connect-timeout "$CONNECTION_TIMEOUT" #\
	#| jq

	EXIT_CODE="$?"
	printf "\nexit code: %s\n" $EXIT_CODE

	#EXIT_CODE=0
	if [ "$EXIT_CODE" = "0" ]; then
		echo "successful post, removing $TARGET_FILE_ABS"
		sudo rm "$TARGET_FILE_ABS"
	else
		echo "failed: [$EXIT_CODE] ($TARGET_FILE_ABS -> $URL)[$HTTP_CODE]"
	fi

) 9<"$TARGET_FILE_ABS"

