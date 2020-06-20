const express = require('express');
const uniqid = require('uniqid');
const File = require('../models/file');
const router = new express.Router();
const path = require('path');
const fs = require('fs');
const { promisify } = require("util");
const deleteFile = promisify(fs.unlink)


router.post('/upload', function (req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
      }
      const fileId = uniqid();

      let uploadFile = req.files.fileUploaded;
      const {mimetype, name, size} = uploadFile
      const mime = mimetype.replace('image/', '')
      const pathFile = path.join('@','../', 'img', fileId + '.' + mime)

      uploadFile.mv(pathFile, async function(err) {
            if (err) return res.status(500).send(err);
            await File.create({
                id:fileId,
                name: name, 
                mimetype: mimetype, 
                type: mime, 
                size: size
            })
            res.send({message: 'File uploaded!', fileId: fileId});
      });
});
router.get('/list', function (req, res) {
    const size = req.body.list_size ? +req.body.list_size : 10
    const page = req.body.page ? +req.body.page : 1
    const nextPage = (page * size) - size

    File.findAndCountAll({
        limit: size,
        offset: nextPage,
        order: [
            ['createdAt', 'ASC']
        ]
    }).then(function (result) {
        res.send({
            next_page: page + 1, 
            current_page: page, 
            list_size: size,
            ...result, 
        });
    });
});
router.delete('/delete/:id', async function (req, res) {
    const file = await File.findOne({where: {id: req.params.id}});
    const appDir = path.dirname(require.main.filename);
    const id = req.params.id
    if(file) {
    const pathFile = path.resolve(appDir,'img/', id)
        try {
            await File.destroy({where: { id: id}})
            await deleteFile(pathFile  + '.' + file.type)
            res.status(200).send({message: 'file was deleted', id})
        }catch(err) {
            res.status(400).send({error: err.message})
        }
    } else {
        res.status(400).send({error: 'file not exists'})
    }
});
router.get('/:id', async function (req, res) {
        try {
        const file = await File.findOne({where: {id: req.params.id}});
            if(file) res.status(200).send(file)
            else res.status(400).send({error: "file das not exist"})
            
        }catch(err) {
            res.status(400).send({error: err.message})
        }

});
router.get('/download/:id', async function (req, res) {
    const id = req.params.id
    const file = await File.findOne({where: {id: id}});
    const appDir = path.dirname(require.main.filename);
    const fileName = id + '.' + file.type
    const pathFile = path.resolve(appDir,'img/', fileName)
    if(file) {
        res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
        res.setHeader('Content-type', file.mimetype);
        const filestream = fs.createReadStream(pathFile);
              filestream.pipe(res);
    } else {
        res.status(400).send({error: 'file not exists'})
    }
});
router.put('/update/:id', function (req, res) {
    res.send('update file')
});

module.exports = router