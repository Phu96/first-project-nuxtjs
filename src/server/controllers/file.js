const fs = require('fs-extra')
const path = require('path')


const rootDir = path.join(__dirname, '../');

//check whether file is directory
const isDirectory = (path) => {
    return fs.lstatSync(path).isDirectory()
}

const getDirectoriesAndFiles = (pathDir) => {
    return new Promise((resolve, reject) => {
        fs.readdir(pathDir).then(list => {
            let infoDirs = []
            let Dirs = list.filter(item => {
                    return isDirectory(pathDir + '/' + item)
            })
            infoDirs = Dirs.map(dir => fs.statSync(`${pathDir}/${dir}`)).map(infoD => {
                return {
                    birth: new Date(infoD.birthtime).toLocaleString(),
                    size: infoD.size,
                    mtime: new Date(infoD.mtime).toLocaleString()
                }
            })
            Dirs.map((dir, index) => {
                infoDirs[index].name = dir
            })
            let infoF = getFiles(pathDir, list)
            resolve({infoDirs, infoF})
        })
        .catch(e => {
            reject(e)
        })
    })
}

const getFiles = (path, list) => {

    let infoF = []
    let files = list.filter(item => {
        return !isDirectory(path + '/' + item)
    })
    infoF = files.map(file => fs.statSync(`${path}/${file}`)).map(infoF => {
        return {
            birth: new Date(infoF.birthtime).toLocaleString(),
            size: infoF.size,
            mtime: new Date(infoF.mtime).toLocaleString()
        }
    })
    files.map((name, index) => {
        infoF[index].name = name
    })
    return infoF
}



exports.getList = (dir) => {
    const pathDir = (dir)? rootDir + '/' + dir : rootDir + 'files'
    return new Promise((resolve, reject)=> {
        getDirectoriesAndFiles(pathDir)
        .then(obj => {
            resolve(obj)
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


exports.addSubDir = ({name, dir}) => {
    const pathDir = (dir)? rootDir + '/' + dir : rootDir + 'files'
    return new Promise((resolve, reject) => {
        fs.stat(`${pathDir}/${name}`)
        .then(() => {
            reject('Directory already exists, please choose a different name')
        })
        .catch(e => {
            fs.ensureDir(`${pathDir}/${name}`).then(() => {
                resolve()
            })
            .catch(e => {
                reject(e)
            })
        })
    })
}


exports.deleteDir = ({dirName, dir}) => {
    const pathDir = (dir)? rootDir + '/' + dir : rootDir + 'files'
    return new Promise((resolve, reject) => {
        fs.remove(`${pathDir}/${dirName}`).then(() => {
            resolve()
        })
        .catch(e => {
            reject(e)
        })
    })
}