const express = require('express');
const uniqid = require('uniqid');
const File = require('../models/file');
const auth = require('../middleware/auth');
const router = new express.Router();
const fs = require('fs');
const path = require('path');
const Busboy = require('busboy');

router.post('/upload', function (req, res) {
    var busboy = new Busboy({ headers: req.headers });
    busboy.on('file', async function(fieldname, file, filename, encoding, mimetype) {
        const mime =   mimetype.replace('image/', '')
        const fileId = uniqid();
        var saveTo = path.join(os.tmpDir(), path.basename(fileId));
        let fstream = fs.createWriteStream(path.join('@','../', 'img', fileId))
            file.pipe(fstream);

        file.on('data', async function(data) {
                await File.create({id:fileId,name: filename,mimetype: mimetype,type: mime,size: data.length})
                return
          });
          file.on('end', function() {
            console.log('File [' + fieldname + '] Finished');
            return
          });
      });
      busboy.on('finish', async function() {
            res.writeHead(201, { file: fileId });
            res.end("File was upload with id: " + fileId);
        });
      return req.pipe(busboy);
    // busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        
    //     file.on('data', function(data) {
    //     const mime =   mimetype.replace('image/', '')
    //     const fileId = uniqid();
    //     //Path where image will be uploaded
    //     fstream = fs.createWriteStream(path.join('@','../', 'img', fileId))
    //     file.pipe(fstream);
    //      fstream.on('finish', async function () {    
    //         try {
    //         const fileToBase = await File.create({id:fileId,name: filename,mimetype: mimetype,type: mime,size: data.length})
    //         if(fileToBase) {  
    //             res.writeHead(303, { Connection: 'close', file: fileId });
    //             res.end("File was upload with id: " + fileId);
    //             return
    //         }
    //         }catch(err) {
    //             await fs.unlink(path.join('@','../', 'img', fileId), function() {
    //                 res.writeHead(403, { Connection: 'close', file: fileId });
    //                 res.end("File was not upload");
    //                 return
    //          });
               
    //         }
    //     });
    //   });
    // });
    // req.pipe(req.busboy);
});
router.get('/list', function (req, res) {
    res.send('rest api')
});
router.delete('/delete/:id', function (req, res) {
    res.send('rest api')
});
router.get('/:id', function (req, res) {
    res.send('rest api')
});
router.get('/download/:id ', function (req, res) {
    res.send('rest api')
});
router.put('/update/:id', function (req, res) {
    res.send('rest api')
});

module.exports = router