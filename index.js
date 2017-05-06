const express = require('express');
const app = express();
const path = require('path');
const formidable = require('formidable');
const randomstring = require('randomstring');
const sha256 = require('sha256');
app.listen(8080, () => {
    console.log(`On port 8080`);
});
app.get('/', (req, res ) => {
    res.sendFile(path.join(`${__dirname}/pages/index.html`));
});
app.post('/upload', (req, res) => {
    const form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.parse(req);
    // I took some of the code from the repo I made before
    // https://github.com/felixfong227/fileupload
    form.on('fileBegin', (name, file) => {
        const fileExtension = path.extname(file.name);
        const newFileID = sha256( randomstring.generate(10) );
        const filePath = newFileID + fileExtension;
        file.path = path.join(`${__dirname}/uploads/${filePath}`);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            status: 200,
            image: {
                name: filePath,
                url: `http://localhost:8080/view/image/${filePath}`,
            },
        }, null, 2));
    });
});

app.get('/view/image/:path?', (req, res) => {
    const image = req.params.path;
    res.sendFile(path.join(`${__dirname}/uploads/${image}`));
});
