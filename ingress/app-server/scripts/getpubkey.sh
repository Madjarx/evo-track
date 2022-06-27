#!/usr/bin/env bash

# Uses certificate to print public key

client_crt="./tmp/client.crt"

openssl x509 -in $1 -noout -pubkey