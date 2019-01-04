const fs = require('fs-extra');
const path = require('path')

const fileController = require('../controllers/file')


var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    res.send({
        success: true,
        message: "Hello World from Express JS"
    })
})

router.post('/file/get', (req, res, next) => {
    fileController.getListFile(req.body.childDir)
    .then((list) => {
        res.send({
            success: true,
            listFiles: list.listFiles,
            childDirs: list.childDirs,
            message: "get list file successfully"
        })
    })
    .catch(e => {
        res.send({
            success: false,
            listFile: [],
            childDir: [],
            message: e
        })
    })
})

router.post('/file/create', (req, res, next)=> {
    fileController.addFile(req.body)
    .then(() => {
        res.send({
            success: true,
            message: "file created"
        })
    })
    .catch(e => {
        res.send({
            success: false,
            message: e
        })
    })
})


router.post('/file/delete', (req, res, next) => {
    fileController.deleteFile(req.body)
    .then(() => {
        res.send({
            success: true,
            message: "file deleted"
        })
    })
    .catch(e => {
        res.send({
            success: false,
            message: e
        })
    })
})

module.exports = router
