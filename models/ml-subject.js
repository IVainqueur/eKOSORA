const mongo = require('mongoose')

const subjectSchema = mongo.Schema({
    title: String,
    code: String
})

module.exports = mongo.model('subject', subjectSchema)