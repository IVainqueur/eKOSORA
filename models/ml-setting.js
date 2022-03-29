const mongo = require('mongoose')

const settingSchema = mongo.Schema({
    key: String,
    value: Object
})

module.exports = mongo.model('setting', settingSchema)