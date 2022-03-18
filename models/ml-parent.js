const mongo = require('mongoose')

const parentSchema = mongo.Schema({
    names: String,
    email: String,
    tel: String,
    password: {
        type: String,
        default: 'password@123'
    },
    children: Array,
    profileLink: String
})

module.exports = mongo.model('parent', parentSchema)