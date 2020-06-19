const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();
const fs = require('fs');
const path = require('path');

router.post('/upload', function (req, res) {
    
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename);

        //Path where image will be uploaded
        fstream = fs.createWriteStream(path.join('@','../', 'img', filename))
        file.pipe(fstream);
        fstream.on('close', function () {    
            console.log("Upload Finished of " + filename);              
            res.send("Upload Finished of " + filename);      //where to go next
        });
    });

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