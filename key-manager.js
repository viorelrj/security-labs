const { writeFileSync, existsSync, readFileSync, read } = require('fs');
const crypto = require('crypto');

class KeyManager {
    static #publicPath = './public.pem';
    static #privatePath = './private.pem';

    #privateKey;
    #publicKey;

    constructor() {
        if (!existsSync(KeyManager.#privatePath) || !existsSync(KeyManager.#publicPath)) {
            const { publicKey, privateKey} = this.#createKeys();
            this.#setKeyPair(publicKey, privateKey)
            this.#saveKeysToFs(publicKey, privateKey);
        } else {
            const { publicKey, privateKey } = this.#loadKeysFromFs();
            this.#setKeyPair(publicKey, privateKey)
        }
    }

    #createKeys = (passphrase = '') => crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: passphrase,
        },
    });

    #setKeyPair = (publicKey, privateKey) => {
        this.#publicKey = publicKey;
        this.#privateKey = privateKey;
    }

    #saveKeysToFs = (publicKey, privateKey) => {
        writeFileSync(KeyManager.#privatePath, privateKey);
        writeFileSync(KeyManager.#publicPath, publicKey);
    }

    #loadKeysFromFs = () => ({
        publicKey: readFileSync(KeyManager.#publicPath),
        privateKey: readFileSync(KeyManager.#privatePath)
    });

    encrypt = (data) => crypto.publicEncrypt(
        {
            key: this.#publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        },
        Buffer.from(data)
    )

    decrypt = (data) => crypto.privateDecrypt(
        {
            key: this.#privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
            passphrase: ''
        },
        Buffer.from(data)
    ).toString()
}

module.exports = {
    KeyManager
};