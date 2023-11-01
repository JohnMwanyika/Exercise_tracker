require('dotenv').config();
const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

async function main() {
    await mongoose.connect(process.env.DB_URL);
};

main().then(() => console.log('Datatebase connected')).catch((e) => console.log(e.message));

module.exports = { Schema, model, Types };