#!/usr/bin/env bash

HOME=$(realpath $( cd "${BASH_SOURCE[0]%/*}" && pwd ))

pushd "${HOME}/evo-ingress"

./exec-test.sh