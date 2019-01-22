const fs = require('fs-extra');
const path = require('path')

const fileController = require('../controllers/file')
const userController = require('../controllers/user')


var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    res.send({
        success: true,
        message: "Hello World from Express JS"
    })
})
/*
===============File API=======================
 */
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


router.post('/file/txt/read', (req, res, next) => {
    fileController.readFileTxt(req.body)
    .then((fileData) => {
        res.send({
            success: true,
            message: 'get file data successfully',
            fileData: fileData
        })
    })
    .catch(e => {
        res.send({
            success: false,
            fileData: [],
            message: e
        })
    })
})


router.post('/file/txt/save', (req, res, next) => {
    fileController.saveFileTxt(req.body).then(newFileData => {
        res.send({
            success: true,
            message: 'data saved',
            newFileData: newFileData
        })
    })
    .catch(e => {
        res.send({
            success: false,
            message: e
        })
    })
})



router.post('/file/txt/deleteRow', (req, res, next) => {
    fileController.deleteRowFileTxt(req.body).then(newFileData => {
        res.send({
            success: true,
            message: 'delete row file successfully',
            newFileData: newFileData
        })
    })
    .catch(e => {
        res.send({
            success: false,
            message: e
        })
    })
})


router.post('/file/txt/createRow', (req, res, next) => {
    fileController.createRowFileTxt(req.body).then(newFileData => {
        res.send({
            success: true,
            message: 'row file data table created',
            newFileData: newFileData
        })
    })
    .catch(e => {
        res.send({
            success: false,
            message: e
        })
    })
})

/*
====================USER API=====================
 */
router.get('/user/getAll', (req, res, next) => {
    userController.getAll().then(listUser => {
        res.send({
            success: true,
            message: 'get list user successfully',
            listUser: listUser
        })
    })
    .catch(e => {
        res.send({
            success: false,
            message: e,
        })
    })
})

router.post('/user/create', (req, res, next) => {
    userController.createUser(req.body).then(listUser => {
        console.log(listUser.length)
        res.send({
            success: true,
            message: 'user created successfully',
            listUser: listUser
        })
    })
    .catch(e => {
        res.send({
            success: false,
            message: e,
        })
    })
})
module.exports = router
