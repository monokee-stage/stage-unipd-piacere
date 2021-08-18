docker build ./mongo_db -t mongo_db
docker run -p 27017:27017 -d --name mongo_db1 mongo_db

docker run -p 6379:6379 -d --name redis1 redis