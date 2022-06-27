#!/usr/bin/env bash

source ~/.bashrc

~/.acme.sh/acme.sh --issue --standalone -d localhost \
    --server https://localhost:9000/acme/acme/directory \
    --ca-bundle ./private/ca-server.crt \
    --fullchain-file bar.crt \
    --key-file bar.key \
    --force \
    --debug

    