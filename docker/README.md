# evo-track/Docker

 - testbed for evo-track/ingress-{client,server}

## (re)Starting the containers
```
./exec-again.sh
```

## Stopping the containers
```
docker-compose down
docker container rm --force $(docker ps -a -q)
docker volume rm --force $(docker volume ls -q)
```

# References

 - https://github.com/ttncat/ttncat-docker-compose
