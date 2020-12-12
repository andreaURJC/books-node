const mongoose = require('mongoose');
var bookSchema = new mongoose.Schema({
    bookId: Number,
    title: String,
    summary: String,
    postYear: Number,
    author: String,
    publisher: String,
    comments: [{
        bookId: Number,
        commentId: Number,
        user: String,
        text: String,
        score: Number
    }]
}, {versionKey: false});

//Definimos el modelo y el esquema
module.exports = mongoose.model('Book', bookSchema, 'books');