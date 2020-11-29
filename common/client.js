const { MongoClient } = require('mongodb');
const OutsidePromise = require('./outside-promise');

class ServerClient {
    db;
    keyManager;

    executeInConnection = (processPromise) => {
        const { resolve, promise } = OutsidePromise();

        MongoClient.connect("mongodb://localhost:27017/nodemongo", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) {
                reject();
                throw err;
            };
            processPromise(db).then(res => resolve(res)).then(() => db.close());
        });

        return promise;
    }

    constructor(keyManager, dbName) {
        this.keyManager = keyManager;
        this.db = dbName;
    }
}

module.exports = {
    ServerClient
}