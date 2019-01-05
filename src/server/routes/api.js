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
    fileController.getList(req.body.childDir)
    .then((list) => {
        res.send({
            success: true,
            listF: list.infoF,
            childDirs: list.infoDirs,
            message: "get list file successfully"
        })
    })
    .catch(e => {
        res.send({
            success: false,
            listF:[],
            childDirs: [],
            message: e
        })
    })
})

router.post('/file/create', (req, res, next) => {
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

router.post('/file/createDir', (req, res, next) => {
    fileController.addSubDir(req.body)
    .then(() => {
        res.send({
            success: true,
            message: "subdirectory created"
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


router.post('/file/deleteDir', (req, res, next) => {
    fileController.deleteDir(req.body)
    .then(() => {
        res.send({
            success: true,
            message: "Directory deleted"
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
