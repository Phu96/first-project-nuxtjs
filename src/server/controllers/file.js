const fs = require('fs-extra')
const path = require('path')


const rootDir = path.join(__dirname, '../');


exports.getListFile = (dir) => {
    const pathDir = (dir)? rootDir + '/' + dir : rootDir + 'files'
    console.log(pathDir)

    return new Promise((resolve, reject)=> {
        fs.readdir(pathDir).then(list => {
            let info = []
            let indexChildDir = []
            let childDirs = []
            if(list) {
                info = list.map(file => fs.stat(pathDir + `/${file}`))
            }
            return Promise.all(info)
        .then(responses => {
            let listFiles = responses.map((infoF, index) => {
                if(infoF.isDirectory()){ 
                    indexChildDir.push(index)
                }
                return {
                    birth: new Date(infoF.birthtime).toLocaleString(),
                    size: infoF.size,
                    mtime: new Date(infoF.mtime).toLocaleString()
                }
                
            })
        
            indexChildDir.map(index => {
                childDirs.push(list[index])
            })

            listFiles.splice(indexChildDir[0], indexChildDir.length)
            
            list.splice(indexChildDir[0], indexChildDir.length)

            list.map((name, index) => {
                listFiles[index].name = name
            })
            resolve({listFiles, childDirs})
            })
        })
        .catch(e => {
            reject(e)
        })
    })
    
}

exports.addFile = ({fileName, fileContent, dir}) => {
    const pathDir = (dir)? rootDir + '/' + dir : rootDir + 'files'
    return new Promise((resolve, reject) => {
        fs.appendFile(`${pathDir}/${fileName}.txt`, fileContent).then(() => {
            resolve()
        })
        .catch(e => {
            reject(e)
        })
    })
}


exports.deleteFile = ({fileName, dir}) => {
    const pathDir = (dir)? rootDir + '/' + dir : rootDir + 'files'
    return new Promise((resolve, reject) => {
        fs.remove(`${pathDir}/${fileName}`).then(() => {
            resolve()
        })
        .catch(e => {
            reject(e)
        })
    })
}