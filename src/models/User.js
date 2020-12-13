const mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    id: Number,
    nick: String,
    email: String,
}, {versionKey: false});

//Definimos el modelo y el esquema
module.exports = mongoose.model('User', userSchema, 'users');