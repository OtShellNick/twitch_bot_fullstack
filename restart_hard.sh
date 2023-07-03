#!/bin/bash

DELAY=10

docker-compose down
# echo "****** Waiting for ${DELAY} seconds for containers to go down ******"
# sleep  $DELAY
docker system prune -a
docker rm -f $(docker ps -qa)
# echo "****** Waiting for ${DELAY} seconds for containers to untag ******"
# sleep $DELAY
docker rmi -f $(docker images -aq)

docker-compose up -d

echo "****** Waiting for ${DELAY} seconds for containers to go up ******"
sleep $DELAY