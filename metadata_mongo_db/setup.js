let conn = Mongo();
let db = conn.getDB("metadata")
db.createCollection("metadata")
let coll = db.getCollection("metadata")
let met = {
	"_id" : "domain1",
    "metadata_url" : "https://new.monokee.com/oauth2/.well-known/oauth-authorization-server/de037da2-054e-496e-b701-791cf65f0947?domain_id=8214e0ab-5f42-410a-b393-8966a1066d06",
    "core" : {
        "client_id" : "ZtYQ3VFH2yyKLscL",
        "client_secret" : "MMBg1PN2GcKrSGY6olYsk2saeM0f0NBSnT5J90iEcgk="
    },
    "app_mobile" : {
        "client_id" : "R^zd$vZ8KRf5MDbR"
    },
    "introspection_endpoint" : "https://new.monokee.com/oauth2/de037da2-054e-496e-b701-791cf65f0947/token/introspect?domain_id=8214e0ab-5f42-410a-b393-8966a1066d06"
}
coll.insertOne(met)