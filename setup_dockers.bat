docker network create -d bridge net1

docker build ./codice -t node_server
docker run -p 3001:3001 -d --name node_server1 --network=net1 node_server

docker build ./metadata_mongo_db -t metadata_mongo_db
docker run -d --name metadata_mongo_db1 --network=net1 metadata_mongo_db

docker build ./mongo_db -t mongo_db
docker run -d --name mongo_db1 --network=net1 mongo_db

docker run -d --name redis1 --network=net1 redis