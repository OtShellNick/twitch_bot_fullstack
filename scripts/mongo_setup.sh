#!/bin/bash

cat /../.env

export MONGO_USERNAME
export MONGO_PASSWORD

. /../.env

DELAY=10
echo "sleeping for 10 seconds"
sleep $DELAY

echo mongo_setup.sh time now: `date +"%T" `
mongosh --host mongo1:27017 <<EOF
  var cfg = {
    "_id": "rs0",
    "version": 1,
    "members": [
      {
        "_id": 0,
        "host": "mongo1:27017",
        "priority": 2
      }
    ]
  };
  rs.initiate(cfg);
  exit
EOF
echo "--------------------- SLEEP $DELAY SECONDS FOR WAITING CONF DATABASE ---------------------"
sleep $DELAY
mongosh --host mongo1:27017 <<EOF
  rs.status();
  use witch-database;
  db.createUser({ user: '$MONGO_USERNAME', pwd: '$MONGO_PASSWORD', roles: [{ role: 'root', db: 'admin' }] });

  db.createCollection('chat_logs', { capped: true, size: 10000, max: 10 });
  db.createCollection('server_logs', { capped: true, size: 10000, max: 10 });
  exit
EOF