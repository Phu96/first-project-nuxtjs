const fs = require('fs-extra');
const path = require('path')

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

router.get('/file', (req, res, next) => {
    fs.readFile(LIST_FILE, (err, data) => {
        res.json(JSON.parse(data))
    })
})

router.post('/file/create', (req, res, next) => {
    fs.readFile(LIST_FILE, (err, data) => {
        if (err) {
            console.log(err);
            return
        }else {
            let list = JSON.parse(data);
            list.push(req.body)
            fs.appendFile(pathFileFolder + `/${req.body.fileName}.txt`, req.body.contentFile, err=> {
                if (err) console.log(err);
                fs.writeFile(LIST_FILE, JSON.stringify(list, null, 4), err => {
                    if(err) console.log(err)
                    res.json(list);
                })
            })
        }
    })
})


router.post('/file/delete', (req, res, next) => {
    fs.readFile(LIST_FILE, (err, data) => {
        if(err) {
            console.log(err);
            return
        }else {
            let list = JSON.parse(data);
            fs.remove(pathFileFolder + `/${list[req.body.index].fileName}.txt`, err => {
                if(err) console.log(err)
                console.log('file deleted')
                list.splice(req.body.index, 1);
                fs.writeFile(LIST_FILE, JSON.stringify(list, null, 4), err => {
                    if(err) console.log(err)
                    res.json(list);
                })
            })
        }
    })
})

module.exports = router
