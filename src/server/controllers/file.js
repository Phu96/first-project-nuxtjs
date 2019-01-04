const fs = require('fs-extra')
const path = require('path')

const pathFileFolder = path.join(__dirname, '../', 'files')



exports.getListFile = (req, res, next) => {
    fs.readdir(pathFileFolder).then(listfile => {
        if(listfile) {
            let info = listfile.map(file => fs.stat(pathFileFolder + `/${file}`))
            Promise.all(info)
            .then(responses => {
                let listInfoFile = responses.map(infoF => {
                    return {
                        birth: new Date(infoF.birthtime).toLocaleString(),
                        size: infoF.size,
                        mtime: new Date(infoF.mtime).toLocaleString()
                    }
                })
                listfile.map((name, index) => {
                    listInfoFile[index].name = name
                })
                res.send({
                    success: true,
                    list: listInfoFile,
                    message: ''
                })
            })
        }
    })
    .catch(e => {
        res.send({
            success: false,
            list: [],
            message: e
        })
    })
}

exports.addFile = (req, res, next) => {
    fs.appendFile(pathFileFolder + `/${req.body.fileName}.txt`, req.body.fileContent).then(() => {
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
}


exports.deleteFile = (req, res, next) => {
    fs.remove(pathFileFolder + `/${req.body.name}`).then(() => {
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
}