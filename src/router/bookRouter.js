const express = require('express');
const Book = require('../models/Book');
const Comment = require('../models/Comment');

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
            if (err) {
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
                res.status(404).send();
            }
            if (book != null) {
                console.log('GET comments for Book' + req.params.bookId);

                Comment.find({bookId: req.params.bookId}, function (err, comments) {
                    if (err) {
                        console.log("Cannot access to comments.")
                        res.status(200).jsonp(book);
                    }
                    if (comments != null) {
                        book.comments = comments;
                        res.status(200).jsonp(book);
                    }
                })
            } else {
                res.status(404).send("Book at id " + req.params.bookId + " not found");
            }
        });
    });

bookRouter.route('/comments')
    .get(function (req, res) {
        Comment.find(function (err, comments) {
            if (err) {
                res.status(404).send("Cannot find any comments");
            }
            console.log('GET/comments/')
            res.status(200).jsonp(comments);
        });
    });

bookRouter.route("/books/:bookId/comments")
    .post(function (req, res) {
        var commentId = 0;
        //Comprueba que el libro existe
        Book.findOne({bookId: req.params.bookId}, function (err, book) {
            if (err) {
                res.status(404).send("This book doesn't exist.");
            }
            if (book != null) {
                //Cuenta los comentarios para asignar un nuevo id
                Comment.countDocuments(function (err, count) {
                    if (err) {
                        console.log("Cannot count docs");
                    }
                    commentId = count + 1;
                    const comment = new Comment({
                        user: req.body.user,
                        text: req.body.text,
                        score: req.body.score,
                        commentId: commentId,
                        bookId: req.params.bookId,
                    });
                    //Guarda el comentario
                    comment.save(function (err, comment) {
                        if (err) {
                            res.status(500).send(err.message);
                        }
                        res.status(200).jsonp(comment);
                    })
                })
            } else {
                res.status(404).send("Book at id " + req.params.bookId + " not found");
            }
        });
    });

module.exports = bookRouter;