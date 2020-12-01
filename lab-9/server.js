const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const { MongoClient} = require('mongodb');

var url = "mongodb://localhost:27017/nodemongo";
const mongoConf = { useNewUrlParser: true, useUnifiedTopology: true };

const { readFile } = require('fs');

app.use(cookieParser());
app.use(express.json())

app.post("/login", (req, res) => {
    res
        .writeHead(200, {
            "Set-Cookie": "token=encryptedstring; SameSite=Lax; HttpOnly",
            "Access-Control-Allow-Credentials": "true"
        })
        .send();
});

app.get('/posts', (req, response) => {
    MongoClient.connect(url, mongoConf, (err, db) => {
        db.db('lab-9').collection('posts').find().toArray().then(result => {
            db.close();
            response.writeHead(200, {
                'Content-Type': 'text/json',
                'Access-Control-Allow-Origin': '*',
                'X-Powered-By': 'nodejs'
            });
            response.write(JSON.stringify(result));
            response.end();
        })
    })
})

app.post("/post", (req, response) => {
    if (!req.cookies.token) return response.status(401).send();

    console.log(req.body);
    response.end();

    MongoClient.connect(url, mongoConf, (err, db) => {
        db.db('lab-9').collection('posts').insertOne({
            name: 'Cookie Monster',
            content: req.body.content
        }).then(result => {
            db.close();
            response.status(200)
            response.end();
        })
    })
    
    
});

app.listen(3001, () => {
    console.log("listening on port 3001...");
});

const PUBLIC = './public/';
const returnPage = (res, addr) => readFile(addr, 'utf-8', (err, page) => res.end(page));
app.get('/', (req, res) => {
    returnPage(res, `${PUBLIC}index.html`)
});
app.get('/public/*', (req, res) => {
    const mime = {
        'css': 'text/css',
        'js': 'text/javascript'
    }

    readFile(`.${req.path}`, 'utf-8', (err, page) => {
        const extension = req.path.split('/').pop().split('.').pop();
        res.writeHead(200, { "Content-Type": mime[extension] });
        res.end(page)
    });
})

