const { Schema, model } = require('../config/config');

const exerciseSchema = Schema({
    username: String,
    description: String,
    duration: Number,
    date: { type: Date, default: Date.now }
});

const Exercise = model('Exercise', exerciseSchema);

module.exports = { Exercise };