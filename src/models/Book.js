const mongoose = require('mongoose');
var bookSchema = new mongoose.Schema({
    bookId: Number,
    title: String,
    summary: String,
    postYear: Number,
    author: String,
    publisher: String

}, {versionKey: false});

//Definimos el modelo y el esquema
module.exports = mongoose.model('Book', bookSchema, 'books');