#!/usr/bin/env bash

# Init CA with the files that have been "volume-d" into the container
step ca init \
    --name=JWTdealer \
    --dns=localhost \
    --address=:9000 \
    --provisioner=admin \
    --root=/home/step/server/ca.crt \
    --key=/home/step/secrets/ca.key \
    --password-file=/home/step/secrets/password

# Start ACME server
step ca provisioner add acme --type ACME

# Hand off to the CMD
/bin/sh -c "$@"