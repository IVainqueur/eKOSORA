const mongo = require("mongoose");

const tokenSchema = mongo.Schema({
    value:{
        type: String,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    }
})
