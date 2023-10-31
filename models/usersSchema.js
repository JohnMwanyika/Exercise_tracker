const { Schema, model } = require('../config/config');

const userSchema = Schema({
    username: { type: String, required: true },
});

const User = model('User', userSchema);

module.exports = { User };