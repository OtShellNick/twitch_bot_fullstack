#!/bin/bash

DELAY=10

docker-compose down
docker rm -f $(docker ps -a -q)
docker volume rm $(docker volume ls -q)

docker-compose up -d

sleep 20

docker compose exec -T mongo1 sh -c 'mongorestore --archive' < ./backups/db.archive

sleep 5