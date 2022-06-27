#!/bin/bash

if [ "$(ls -A ./ingress-bucket)" ]; then
    echo "$(ls ./ingress-bucket/ | wc -l)"
else
    exit 0
fi