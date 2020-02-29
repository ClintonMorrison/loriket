#!/bin/bash

source version.sh

PROJECT_PATH="$HOME/go/src/github.com/ClintonMorrison/lorikeet"
CONTAINER_PATH="/opt/go/src/github.com/ClintonMorrison/lorikeet"

docker run -d \
  --name lorikeet \
  -p "8020:80" \
  -v "$PROJECT_PATH/data:$CONTAINER_PATH/data" \
  -v "$PROJECT_PATH/log:$CONTAINER_PATH/log" \
  -v "$PROJECT_PATH/backup:$CONTAINER_PATH/backup" \
  "clintonmorrison/projects:lorikeet-$VERSION"
