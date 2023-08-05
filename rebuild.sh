#!/bin/bash

if [ $# -eq 0 ]; then
  echo "Please provide the name of the Docker Compose service to update."
  exit 1
fi

service_name=$1

# Проверить, является ли сервис базой данных
if [ "$service_name" == "mongo1" ]; then
  # Создать резервную копию файлов базы данных
  mkdir -p ./backups
  docker-compose exec -T mongo1 sh -c 'mongodump --db=witch-database --archive' > ./backups/db.archive

  # Остановить и удалить существующие контейнеры
  docker-compose down

  # Удалить существующий образ
  docker rmi -f $(docker images -q mongo1)

  # Пересоздать и запустить только указанный сервис
  docker-compose up -d --no-deps $service_name

  # Восстановить файлы базы данных из резервной копии
  docker-compose exec -T mongo1 sh -c 'mongorestore --drop --archive' < ./backups/db.archive
else
  # Остановить указанный сервис
  docker-compose stop $service_name

  # Удалить связанные с ним контейнеры и образы
  docker-compose rm -f $service_name

  # Сбилдить указанный сервис
  docker-compose build $service_name

  # Запустить обновленный сервис
  docker-compose up -d $service_name
fi
