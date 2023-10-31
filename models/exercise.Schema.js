const { Schema, model } = require('../config/config');

const exerciseSchema = Schema({
    username: String,
    description: String,
    duration: Number,
});

const Exercise = model('Exercise', exerciseSchema);

module.exports = { Exercise };