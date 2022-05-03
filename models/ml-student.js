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
    },
    profileLink: {
        type: String,
        default: "https://res.cloudinary.com/dyrneab5i/image/upload/v1651564772/h2tjxuh4t7c739ks6ife.png"
    }
})

module.exports = mongo.model('student', studentSchema)