

docker build ./metadata_mongo_db -t metadata_mongo_db
docker run -d -p 27018:27017 --name metadata_mongo_db1 metadata_mongo_db

docker build ./mongo_db -t mongo_db
docker run -d -p 27017:27017 --name mongo_db1 mongo_db

docker run -d -p 6379:6379 --name redis1 redis