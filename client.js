const { MongoClient } = require('mongodb');
const { KeyManager } = require('./key-manager');
const OutsidePromise = require('./outside-promise');

class Client {
    #db = 'lab-7';
    #keyManager;

    #executeInConnection = (processPromise) => {
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

    constructor(keyManager) {
        this.#keyManager = keyManager;
    }

    getAllNotes() {
        return this.#executeInConnection((db) => db.db(this.#db).collection('notes').find().toArray());
    }

    addNote(props) {
        return this.#executeInConnection(
            (db) => db.db(this.#db).collection('notes').insertOne({
                name: props.name,
                content: this.#keyManager.encrypt(props.content)
            })
        )
    }
}

const keyManager = new KeyManager();
const client = new Client(keyManager);

client.getAllNotes()
    .then(notes => content = notes.map(item => item.content.buffer))
    .then(buffers => buffers.map(buffer => keyManager.decrypt(buffer)))
    .then(res => console.log(res))
