const mongo = require('mongoose')

const studentSchema = mongo.Schema({
    names: String,
    code: String,
    class: Object,
    records: {
        type: Array,
        default: []
    },
    password: String,
    email: String,
    parentEmails: {
        type: Array,
        default: []
    }
})

module.exports = mongo.model('student', studentSchema)