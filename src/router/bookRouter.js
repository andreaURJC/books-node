const express = require('express');
const Book = require('../models/Book');

var bookRouter = express.Router();

bookRouter.route('/books')
    //GET all books
    .get(function (req, res) {
        Book.find(function (err, books) {
            if (err) {
                res.status(404).send(err.message)
            }
            console.log('GET/books/')
            res.status(200).jsonp(books);
        });
    })
    //POST book
    .post(function (req, res) {
        var bookId = 0;

        Book.countDocuments(function (err, count) {
            if(err) {
                console.log("Cannot count docs");
            }
            bookId = count + 1;
                const book = new Book({
                    bookId: bookId,
                    title: req.body.title,
                    summary: req.body.summary,
                    author: req.body.author,
                    postYear: req.body.postYear
                });
                book.save(function (err, book) {
                    if (err) {
                        res.status(500).send(err.message);
                    }
                    res.status(200).jsonp(book);
                })

        })




    });

bookRouter.route('/books/:bookId')
    //GET book at id
    .get(function (req, res) {
        Book.findOne({bookId: req.params.bookId}, function (err, book) {
            if (err) {
                res.status(404).send(err.message);
            }
            console.log('GET/books/' + req.params.bookId)
            res.status(200).jsonp(book);
        });
    });

module.exports = bookRouter;