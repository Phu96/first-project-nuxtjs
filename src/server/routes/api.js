const fs = require('fs-extra');
const path = require('path')

const fileController = require('../controllers/file')

const LIST_FILE = path.join(__dirname, '../', 'files/list.json')
const pathFileFolder = path.join(__dirname, '../', 'files')

var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    res.send({
        success: true,
        message: "Hello World from Express JS"
    })
})

router.get('/file', fileController.getListFile)

router.post('/file/create', fileController.addFile)


router.post('/file/delete', fileController.deleteFile)

module.exports = router
