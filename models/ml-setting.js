const mongo = require('mongoose')

const settingSchema = mongo.Schema({
    key: String,
    value: Object,
    access: String
})

module.exports = mongo.model('setting', settingSchema)