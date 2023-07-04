#!/bin/bash

DELAY=10

docker-compose down
docker rm -f $(docker ps -a -q)
docker volume rm $(docker volume ls -q)

docker-compose up -d

docker compose exec -i mongo1 sh -c 'mongorestore --archive' < ./backups/db.archive

sleep 5