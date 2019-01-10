const fs = require('fs-extra')
const path = require('path')


const rootDir = path.join(__dirname, '../');



exports.getChildDir = ({dir}) => {
    const pathDir = (dir)? rootDir + '/' + dir : rootDir
    console.log(pathDir)
    return new Promise((resolve, reject) => {
        fs.readdir(pathDir).then(child => {
            const childDirs = child.filter(item => {
                return isDirectory(pathDir + '/' + item)
            })
            resolve(childDirs) 
        })
        .catch(e => reject(e))  
    })
}

// const getFiles = (path, list) => {

//     let infoF = []
//     let files = list.filter(item => {
//         return !isDirectory(path + '/' + item)
//     })
//     infoF = files.map(file => fs.statSync(`${path}/${file}`)).map(infoF => {
//         return {
//             birth: new Date(infoF.birthtime).toLocaleString(),
//             size: infoF.size,
//             mtime: new Date(infoF.mtime).toLocaleString()
//         }
//     })
//     files.map((name, index) => {
//         infoF[index].name = name
//     })
//     return infoF
// }


const getSingleDirTree = pathDir => {
    let stats = fs.lstatSync(pathDir),
        info = {
            path: pathDir,
            name: path.basename(pathDir)
        };
    if (stats.isDirectory()) {
        info.type = "folder";
        info.children = fs.readdirSync(pathDir).map(function(child) {
            return getSingleDirTree(pathDir + '/' + child);
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


exports.getAllDirTree = () => {
    return new Promise((resolve, reject) => {
        fs.readdir(rootDir).then(dir => {
            const dirTree = dir.map(file => {
                let stats = fs.lstatSync(rootDir + '/' + file)
                if(stats.isDirectory()) {
                    return getSingleDirTree(rootDir + '/' + file)
                } else {
                    let info = {
                        path: rootDir + '/' + file,
                        name: path.basename(rootDir + '/' + file),
                        type: "file"
                    }
                    return info
                }
            }).sort((a, b) => b.type.length - a.type.length).map(child => {
                if(child.type === "folder") {
                    return sortDirTree(child)
                }else return child
            })
            resolve(dirTree)
        })
        .catch(e => reject(e))
    })
}


exports.createFile = ({fileName, fileContent, dir}) => {
    console.log('aaa');
    return new Promise((resolve, reject) => {
        fs.appendFile(`${dir}/${fileName}.txt`, fileContent).then(() => {
            resolve()
        })
        .catch(e => {
            reject(e)
        })
    })
}


exports.deleteFile = ({path}) => {
    console.log(path)
    return new Promise((resolve, reject) => {
        fs.remove(path).then(() => {
            resolve()
        })
        .catch(e => {
            reject(e)
        })
    })
}


exports.createDir = ({name, path}) => {
    return new Promise((resolve, reject) => {
        fs.stat(path + '/' + name)
        .then(() => {
            reject('Directory already exists, please choose a different name')
        })
        .catch(e => {
            fs.ensureDir(path + '/' + name).then(() => {
                console.log('aaa')
                resolve()

            })
            .catch(e => {
                reject(e)
            })
        })
    })
}


exports.deleteDir = ({dirName, dir}) => {
    const pathDir = (dir)? rootDir + '/' + dir : rootDir
    return new Promise((resolve, reject) => {
        fs.remove(`${pathDir}/${dirName}`).then(() => {
            resolve()
        })
        .catch(e => {
            reject(e)
        })
    })
}


exports.readFileTxt = ({file}) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8').then(text => {
            let fileData = []
            if(text.length){
                fileData = text.split('\n').map(line => {
                    let arr = line.split(',').map(item => item.trim())
                    return {
                        order: arr[0],
                        name: arr[1],
                        address: arr[2],
                        date: arr[3]
                    }
                });
            }
            resolve(fileData)
        })
        .catch(e => {
            reject(e)
        })
    })
}


exports.saveFileTxt = ({index, path, data}) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8').then(text => {
            let fileData = text.split('\n').map(line => line.split(','))
            if(fileData[index][0] === data[0]){
                fileData[index] = data
            }
            if(Number(fileData[index][0]) > Number(data[0])) {
                const indexWhenChangeOrdering = fileData.findIndex(item => item[0] === data[0])
                if(indexWhenChangeOrdering < 0 ) {
                    for(var i = 0; i < index; i++) {
                        fileData[i][0] = (Number(fileData[i][0]) + 1).toString()
                    }
                    fileData[index] = data
                    fileData.sort((a, b) => Number(a[0]) - Number(b[0]))
                }else {
                    for(var i = indexWhenChangeOrdering; i < index; i++) {
                        fileData[i][0] = (Number(fileData[i][0]) + 1).toString()
                    }
                    fileData[index] = data
                    fileData.sort((a, b) => Number(a[0]) - Number(b[0]))
                }
            }
            if(Number(fileData[index][0]) < Number(data[0])) {
                const indexWhenChangeOrdering = fileData.findIndex(item => item[0] === data[0])
                console.log(indexWhenChangeOrdering)
                if (indexWhenChangeOrdering < 0){
                    try {
                        for(var i = index + 1; i <= fileData.length; i++) {
                            fileData[i][0] = (Number(fileData[i][0]) - 1).toString()
                        }
                    }catch(e) {
                        console.log(e)
                    }
                    fileData[index] = data
                    fileData.sort((a, b) => Number(a[0]) - Number(b[0]))
                    console.log(fileData)
                }else {
                    for(var i = index + 1; i < indexWhenChangeOrdering + 1; i++) {
                        fileData[i][0] = (Number(fileData[i][0]) - 1).toString()
                    }
                    fileData[index] = data
                    fileData.sort((a, b) => Number(a[0]) - Number(b[0]))
                }
            }
            fileData = fileData.map(line => line.join(','))
            fs.writeFile(path, fileData.join('\n')).then(() => {
                let newFileData = fileData.map(line => {
                    let arr = line.split(',').map(item => item.trim())
                    return {
                        order: arr[0],
                        name: arr[1],
                        address: arr[2],
                        date: arr[3]
                    }
                })
                resolve(newFileData)
            })
            .catch(e => {
                reject(e)
            })
        })
        .catch(e => reject(e))
    })
}


exports.deleteRowFileTxt = ({index, path}) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8').then(text => {
            let newFileData = []
            let fileData = text.split('\n').map(item => item.split(','))
            if(index < fileData.length) {
                for (let i = index + 1; i < fileData.length; i++) {
                    fileData[i][0] = (Number(fileData[i][0]) - 1).toString()
                }
                fileData.splice(index, 1)
                newFileData = fileData.map(item => item.join(','))
            }else {
                fileData.splice(index, 1)
                newFileData = fileData.map(item => item.join(','))
            }
            fs.writeFile(path, newFileData.join('\n')).then(() => {
                newFileData = fileData.map(item => {
                    return {
                        order: item[0],
                        name: item[1],
                        address: item[2],
                        date: item[3]
                    }
                })
                resolve(newFileData)
            })
            .catch(e => {
                console.log(e)
                reject(e)
            })
        })
        .catch(e => reject(e))
    })
}

exports.createRowFileTxt = ({path, data}) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8').then(text => {
            let fileData = []
            if(!text.length) {
                fileData.push([fileData.length + 1, ...data])
            }else {
                fileData = text.split('\n').map(line => line.split(','))
                fileData.push([fileData.length + 1, ...data])
            }
            fileData.sort((a, b) => Number(a[0]) - Number(b[0]))
            let newFileData = fileData.map(item => {
                return {
                    order: item[0],
                    name: item[1],
                    address: item[2],
                    date: item[3]
                }
            })
            fileData.map(line => line.join(','))
            fs.writeFile(path, fileData.join('\n')).then(() => {
                resolve(newFileData)
            })
            .catch(e => reject(e))
        })
        .catch(e => reject(e))
    })
}