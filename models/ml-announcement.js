const mongo = require('mongoose')

announcementSchema = mongo.Schema({
    composer: mongo.Types.ObjectId,
    title: String,
    content: String,
    date: {
        type: Date,
        default: Date.now()
    },
    expiry: {
        type: Date,
        default: Date.now() + 2592000000
    },
    meantFor: Array

})


module.exports = mongo.model('announcement', announcementSchema)