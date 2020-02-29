
source version.sh

docker stop lorikeet
docker rm lorikeet

cd ./ui &&
  npm run build &&
  cd - 

docker build -t "clintonmorrison/projects:lorikeet-$VERSION" . &&
  docker push "clintonmorrison/projects:lorikeet-$VERSION" &&
  echo "Running container..." &&
  sh run_container.sh &&
  docker exec -it lorikeet bash

# /opt/lorikeet/log and /opt/lorikeet/data
