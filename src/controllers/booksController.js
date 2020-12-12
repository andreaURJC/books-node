const mongoose = require('mongoose');

var bookSchema = new mongoose.Schema({
    bookId: Number,
    title: String,
    summary: String,
    postYear: Number,
    author: String,

});

var Book = mongoose.model('Book', bookSchema, 'books');

//GET all books
exports.findAllBooks = function (req, res) {
    Book.find(function (err, books) {
        if (err) {
            res.send(404, err.message)
        }
        console.log('GET/books/')
        res.status(200).jsonp(books);
    });
};

//GET one book by id
exports.findById = function (req, res) {
    Book.findOne({bookId:req.params.bookId},function (err, book) {
        if (err) {
            res.send(404, err.message)
        }
        console.log('GET/books/' + req.param.bookId)
        res.status(200).jsonp(book);
    });
};