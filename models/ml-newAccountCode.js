const mongo = require('mongoose')

const newAccountCode = mongo.Schema({
    userId: String,
    code: String,
    expiryDate: {
        type: Date,
        default: Date.now() + 7200000
    }

})

module.exports = mongo.model('newAcountCode', newAccountCode)