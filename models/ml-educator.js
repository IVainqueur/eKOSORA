const mongo = require("mongoose")

const educatorSchema = mongo.Schema({
    names: String,
    code: String,
    title: String,
    lessons: Array,
    email: String,
    tel: String,
    password: String,
    profileLink: String,
    googleUser: Object,
    allTokens: Object
})

module.exports = mongo.model('educator', educatorSchema)