#!/bin/bash

CONTAINER=${1}

if [[ -z "$CONTAINER" ]]; then
	echo "container name is required"
	exit 1
fi

function fixit (){
	pushd ..
	docker-compose ps
	popd
}

fixit >/dev/null

echo "sure - let me type that for you"
echo ""
echo "docker-compose exec ${CONTAINER} bash"
echo ""

docker-compose exec node-red sh


