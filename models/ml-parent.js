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
    profileLink: {
        type: String,
        default: "https://res.cloudinary.com/dyrneab5i/image/upload/v1651564772/h2tjxuh4t7c739ks6ife.png"
    }
})

module.exports = mongo.model('parent', parentSchema)