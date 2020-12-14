const mongoose = require('mongoose');
var commentSchema = new mongoose.Schema({
    bookId: Number,
    commentId: Number,
    text: String,
    score: Number,
    nick: String,
    email: String
}, {versionKey: false});

//Definimos el modelo y el esquema
module.exports = mongoose.model('Comment', commentSchema, 'comments');