const fs = require('fs-extra')
const path = require('path')

const pathFileFolder = path.join(__dirname, '../', 'files')



exports.getListFile = () => {
    return new Promise((resolve, reject)=> {
        fs.readdir(pathFileFolder).then(listfile => {
            let info = []
            if(listfile) {
                info = listfile.map(file => fs.stat(pathFileFolder + `/${file}`))
            }
            return Promise.all(info)
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
            resolve(listInfoFile)
            })
        })
        .catch(e => {
            reject(e)
        })
    })
    
}

exports.addFile = ({fileName, fileContent}) => {
    return new Promise((resolve, reject) => {
        fs.appendFile(`${pathFileFolder}/${fileName}.txt`, fileContent).then(() => {
            resolve()
        })
        .catch(e => {
            reject(e)
        })
    })
}


exports.deleteFile = ({fileName}) => {
    return new Promise((resolve, reject) => {
        fs.remove(`${pathFileFolder}/${fileName}`).then(() => {
            resolve()
        })
        .catch(e => {
            reject(e)
        })
    })
}