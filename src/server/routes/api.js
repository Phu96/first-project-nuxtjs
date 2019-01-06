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

router.get('/file/getDirTree', (req, res, next) => {
    fileController.getAllDirTree()
    .then((dirTree) => {
        res.send({
            success: true,
            dirTree: dirTree,
            message: "get directory tree successfully"
        })
    })
    .catch(e => {
        res.send({
            success: false,
            dirTree:[],
            message: e
        })
    })
})

router.post('/file/getChildDir', (req, res, next) => {
    fileController.getChildDir(req.body)
    .then(childDirs => {
        res.send({
            success: true,
            childDirs: childDirs,
            message: "get directory tree successfully"
        })
    }).catch(e => {
        res.send({
            success: true,
            childDirs: [],
            message: "get directory tree successfully"
        })
    })
})

router.post('/file/create', (req, res, next) => {
    fileController.createFile(req.body)
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
    fileController.createDir(req.body)
    .then(() => {
        res.send({
            success: true,
            message: "subdirectory created"
        })
    })
    .catch(e => {
        console.log(e)
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
