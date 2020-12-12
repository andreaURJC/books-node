const mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    nick: String,
    email: String,
}, {versionKey: false});

//Definimos el modelo y el esquema
module.exports = mongoose.model('User', userSchema, 'users');