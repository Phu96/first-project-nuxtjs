const fs = require('fs-extra')
const path = require('path')


const rootDir = path.join(__dirname, '../');

//check whether file is directory
const isDirectory = (path) => {
    return fs.lstatSync(path).isDirectory()
}

const getDirectories = (pathDir) => {
    let Dirs = fs.readdirSync(pathDir).filter(item => {
        return isDirectory(pathDir + '/' + item)
    })
    return Dirs
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


function dirTree(filename) {
    var stats = fs.lstatSync(filename),
        info = {
            path: filename,
            name: path.basename(filename)
        };

    if (stats.isDirectory()) {
        info.type = "folder";
        info.children = fs.readdirSync(filename).map(function(child) {
            return dirTree(filename + '/' + child);
        });
    } else {
        // Assuming it's a file. In real life it could be a symlink or
        // something else!
        info.type = "file";
    }

    return info;
}


exports.getList = (dir) => {
    const pathDir = (dir)? rootDir + '/' + dir : rootDir + 'files'
    return new Promise((resolve, reject) => {
        fs.readdir(pathDir).then(() => {
            const treeDir = [dirTree(rootDir + 'files')]
            const childDirs = getDirectories(pathDir)
            resolve({treeDir, childDirs})
        })
        .catch(e => reject(e))
        
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