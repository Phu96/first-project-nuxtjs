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


const dirTree = pathDir => {
    let stats = fs.lstatSync(pathDir),
        info = {
            path: pathDir,
            name: path.basename(pathDir)
        };
    if (stats.isDirectory()) {
        info.type = "folder";
        info.children = fs.readdirSync(pathDir).map(function(child) {
            return dirTree(pathDir + '/' + child);
        });
    } else {
        info.type = "file";
    }

    return info;
}
// sort dirTree according to order (folder => file)
const sortDirTree = dirTree => {

	dirTree.children.sort((a, b) => b.type.length - a.type.length).map(child => {
		if(child.children) return sortDirTree(child)
    })
	return dirTree
}

exports.getList = (dir) => {
    const pathDir = (dir)? rootDir + '/' + dir : rootDir + 'files'
    return new Promise((resolve, reject) => {
        fs.readdir(pathDir).then(() => {
            const childDirs = getDirectories(pathDir)
            let treeDir = dirTree(rootDir + 'files')
            treeDir = [sortDirTree(treeDir)]
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