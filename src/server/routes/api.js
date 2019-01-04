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

router.get('/file', (req, res, next) => {
    fileController.getListFile()
    .then(list => {
        console.log(list)
        res.send({
            success: true,
            list: list,
            message: "get list file successfully"
        })
    })
    .catch(e => {
        res.send({
            success: false,
            list: [],
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
