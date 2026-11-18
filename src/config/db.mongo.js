const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;

db.on('error', error => console.log(error));
db.once('open', () => console.log('Conexion conv MongoDB estable'));

module.exports = mongoose;
