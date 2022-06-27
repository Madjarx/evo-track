#!/usr/bin/env bash

# Stops hanging child processes.

pkill curl

EXIT_CODE="$?"

test "$EXIT_CODE" -e "1" && echo "NO web requests (curl statements) were  killed"
test "$EXIT_CODE" -e "0" && echo "Web requests (curl statements) were killed"

exit 0