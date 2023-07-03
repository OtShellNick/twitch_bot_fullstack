#!/bin/bash

cat .env

export REBUILD

. .env

echo $REBUILD

docker-compose up --force-recreate --build -d $REBUILD
docker image prune -f