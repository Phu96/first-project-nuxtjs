const db = require('../utils/db')
const uuid4 = require('uuid4')

exports.getAll = () => {
    return new Promise((resolve, reject) => {
        const query = "SELECT demo.* FROM `demo` WHERE type = 'user'"
        db.query(query).then(result => resolve(result))
        .catch(e => reject(e))
    })
}

//auto increment ordering user when user created
exports.createUser = (info) => {
    return new Promise((resolve, reject) => {
        const counterKey = 'orderingGeneratorForUser'
        db.counter(counterKey).then(res => {
            const user = {
                id: uuid4(),
                ordering: res,
                name: info.name,
                address: info.address,
                date: info.date,
                type: 'user'
            }
            db.upsert(uuid4(), user).then(res => {
                const query = "SELECT demo.* FROM `demo` WHERE type = 'user'"
                db.query(query).then(result => resolve(result))
                .catch(e => reject(e))
            })
            .catch(e => reject(e))
        })
        .catch(e => reject(e))
    })
}