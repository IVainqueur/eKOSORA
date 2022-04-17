const mongo = require('mongoose');

const academicLevelSchema = mongo.Schema({
    year: Number,
    classes: Array,
    lessons: Array
});

module.exports = mongo.model('academiclevel', academicLevelSchema);