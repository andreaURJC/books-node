const mongoose = require('mongoose');
var bookSchema = new mongoose.Schema({
    id: Number,
    title: String,
    summary: String,
    postYear: Number,
    author: String,

});

//Definimos el modelo y el esquema
module.exports = mongoose.model('Book', bookSchema, 'books');