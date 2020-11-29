const { Client } = require('./client');
const { KeyManager } = require('./key-manager');

const keyManager = new KeyManager();
const client = new Client(keyManager);

client.getAllNotes()
    .then(notes => content = notes.map(item => item.content.buffer))
    .then(buffers => buffers.map(buffer => keyManager.decrypt(buffer)))
    .then(res => console.log(res))
