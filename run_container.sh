#!/bin/bash

source version.sh

CONTAINER_PATH="/opt/go/src/github.com/ClintonMorrison/lorikeet"

docker run -d \
  --name lorikeet \
  -p "8020:80" \
  -v "$LORIKEET_PATH/data:$CONTAINER_PATH/data" \
  -v "$LORIKEET_PATH/log:$CONTAINER_PATH/log" \
  -v "$LORIKEET_PATH/backup:$CONTAINER_PATH/backup" \
  "clintonmorrison/projects:lorikeet-$VERSION"
