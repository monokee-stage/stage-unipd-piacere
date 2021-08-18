conn = Mongo();
db = conn.getDB("mfa")
coll = db.createCollection("devices")