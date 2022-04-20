const mongo = require('mongoose')

const settingSchema = mongo.Schema({
    key: String,
    value: Object,
    access: String,
    editable: Boolean
})

module.exports = mongo.model('setting', settingSchema)