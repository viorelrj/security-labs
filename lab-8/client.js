const { ServerClient } = require('../common/client');
const { KeyManager } = require('../common/key-manager');
const OutsidePromise = require('../common/outside-promise');

class Client extends ServerClient {
    db = 'lab-8';

    addToPending(email, key) {
        this.executeInConnection((db) => db.db(this.db).collection('registrationRequests').insertOne({
            email: this.keyManager.encrypt(email),
            key: key
        }));
    }

    confirm(key) {
        const { resolve, promise } = OutsidePromise();

        return this.executeInConnection(db => db.db(this.db).collection('registrationRequests').find({ key: key }).toArray()).then(res => res.length);
    }
}

class DatabaseClient {
    #client;
    constructor(keyManager) {
        this.#client = new Client(keyManager);
    }

    getClientInstance() {
        return this.#client;
    }
}

module.exports = new DatabaseClient(new KeyManager())