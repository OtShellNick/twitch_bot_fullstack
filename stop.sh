#!/bin/bash

mkdir ./backups
cd ./backups
touch ./db.archive

sleep 5

docker compose exec -T mongo1 sh -c 'mongodump  --db=witch-database --archive' > ./db.archive

docker-compose down
docker rm -f $(docker ps -qa)
docker rmi -f $(docker images -aq)