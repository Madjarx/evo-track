#!/usr/bin/env bash

# Verifies client certificate against CA certificate

ca_crt="./keys/ca-server.crt"
client_crt="./tmp/client.crt"

openssl verify -verbose -x509_strict -CAfile $ca_crt $1