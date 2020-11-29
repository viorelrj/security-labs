const app = require('express')();
const http = require('http').createServer(app);
const { readFile } = require('fs');
const { Mailer } = require('./mailer');

const mailer = new Mailer();
mailer.init();
const client = require('./client').getClientInstance();

const getId = () => Math.random().toString(36).substring(2, 15);


const PUBLIC = './public/';

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

app.get('/', (req, res) => {
    readFile(`${PUBLIC}register/index.html`, 'utf-8', (err, page) => res.end(page));
});

app.get('/control/:email', async (req, res) => {
    const id = getId();
    client.addToPending(req.params.email, id);
    await mailer.send(req.params.email, `http://localhost:3000/confirm/${encodeURIComponent(id) }`)
    res.end();
});

app.get('/confirm/:code', (req, res) => {
    client.confirm(req.params.code).then(result => {
        const text = result? 'Email Confirmed' : 'Something went wrong';

        console.log(text);
        res.end(text)
    })
}) 

http.listen(3000, () => {
    
});