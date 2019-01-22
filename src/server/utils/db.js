const config = require('./config')
const couchbase = require('couchbase')
const cluster  = new couchbase.Cluster(config.couchbase.endPoint)
cluster.authenticate(config.couchbase.user, config.couchbase.password)
const bucket = cluster.openBucket(config.couchbase.bucket)
const N1qlQuery = couchbase.N1qlQuery

const db = bucket


exports.upsert  = (key, value) => {
    return new Promise((resolve, reject) => {
        db.upsert(key, value, (err, res) => {
            if(err) {
                console.log("DB.UPSERT:",key,":", err);
                reject(err)
                return
            }
            resolve(res)
        })
    })
}


exports.read = key => {
    return new Promise((resolve, reject) => {
        db.get(key, (err, res) => {
            if(err){
                console.log('DB.READ:', err)
                reject(err)
                return
            }
            resolve(res)
        })
    })
}


exports.deleteDoc = key => {
    return new Promise((resolve, reject) => {
        db.delete(key, (err, res) => {
            if(err) {
                console.log('DB.DELETE:', err)
                reject(err)
                return
            }
            resolve(res)
        })
    })
}



//Query
exports.query = (sql) => {
    return new Promise((resolve, reject)  => {
        const query = N1qlQuery.fromString(sql)
        db.query(query, (err, result) => {
            if(err) {
                console.log('Query:', err)
                reject(err)
                return
            }
            resolve(result)
        })
    })
}
//counter

exports.counter = (counterKey) => {
    return new Promise((resolve, reject) => {
        db.counter(counterKey, 1, {initial: 0}, function(err, res) {
            if (err) reject(err)
            // insert code here
            resolve(res.value)
        });
    })
}