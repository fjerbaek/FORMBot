use formbot;
db.status.insertOne({"_id":"skiltet", "status": {"isUp": false, "lastDown":""}});
db.status.insertOne({"_id":"skraldespanden", "status":{"filledAmount":0}});
db.tavleEntries.insertOne({"_id":"TEST", "alias": "nf", "potens":1});

