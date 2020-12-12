const mongoose = require('mongoose');
var commentSchema = new mongoose.Schema({
    bookId: Number,
    user: String,
    text: String,
    score: Number
}, {versionKey: false});

//Definimos el modelo y el esquema
module.exports = mongoose.model('Comment', commentSchema, 'comments');