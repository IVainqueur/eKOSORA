const mongo = require('mongoose')

const courseSchema = mongo.Schema({
    title: String,
    code: String,
    accountsFor: Array
})


module.exports = mongo.model('course', courseSchema)