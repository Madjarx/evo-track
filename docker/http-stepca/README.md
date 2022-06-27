# SmallStep CA Report

## Value Proposition

 * Central location for bin keys 
 
 * "always up" service with AWS ECS
 
 * ACME server provides access to CA remotely (to technicians and other services)

## Potential Usage

* Create keys locally during bin provisioning and copy them into server

* Use ACME protocols to create keys 

## Setup

`docker-compose up [-d]`

## File Explanation

 * [private](./private/) - contains private files used in creation of CA. MUST CONTAIN:

    * `ca.crt`
    * `ca.key`
    * `password`

 * [entrypoint.sh](./entrypoint.sh) - Docker entrypoint script (initializes CA and ACME server)

 * [Dockerfile](./Dockerfile) - Dockerfile that moves entrypoint file into container, sets the main running     process as the default Step CA process. Note: base OS is Alpine Linux

 * [docker-compose.yml](./docker-compose.yml) - Uses Dockerfile as image, creates volumes out of private files

 * [issue-crt.sh](./issue-crt.sh) - Uses `acme.sh` to access ACME server in container to create keys (***only works when run inside of container -- which sucks.***)

## ACME Server Clients

A list of clients can be found at https://smallstep.com/blog/private-acme-server/

I tried using `acme.sh` and the SmallStep clients. Both failed challenges because the server does not have DNS records leading the client (read about challenge types: https://letsencrypt.org/docs/challenge-types/ and look at the diagram in the link above)

