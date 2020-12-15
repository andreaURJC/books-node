const express = require('express');
const Book = require('../models/Book');
const Comment = require('../models/Comment');
const User = require('../models/User');

let bookRouter = express.Router();

bookRouter.route('/books')
    //GET all books
    .get(function (req, res) {
        Book.find(function (err, books) {
            if (err) {
                res.status(404).send(err.message)
            }
            let booksResponse = {
                books: books.map(book => {
                    return { bookId: book.bookId, title: book.title }
                })
            };
            res.status(200).jsonp(booksResponse);
        });
    })

    //POST book
    .post(function (req, res) {
        let bookId = 0;

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
                publisher: req.body.publisher,
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
                        let bookResponse = {
                            id: book.bookId,
                            title: book.title,
                            summary: book.summary,
                            author: book.author,
                            publisher: book.publisher,
                            postYear: book.postYear,
                            comments: book.comments.map(comment => {
                                return {
                                    text: comment.text,
                                    nick: comment.nick,
                                    email: comment.email
                                }
                            })
                        }
                        res.status(200).jsonp(bookResponse);
                    }
                })
            } else {
                res.status(404).send("Book at id " + req.params.bookId + " not found");
            }
        });
    });

bookRouter.route('/comments')
    //GET comments
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
    //POST comment at bookId
    .post(function (req, res) {
        let commentId = 0;
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

                    User.findOne({nick: req.body.nick}, function (err, user) {
                        if(err) {
                            res.status(404).send("This user doesn't exist.");
                        }
                        if(user) {
                            const comment = new Comment({
                                nick: req.body.nick,
                                email: user.email,
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
                        } else {
                            res.status(404).send("This user doesn't exist.");
                        }
                    })

                })
            } else {
                res.status(404).send("Book at id " + req.params.bookId + " not found");
            }
        });
    });

bookRouter.route("/books/:bookId/comments/:commentId")
    //DELETE comment of a book
    .delete(function (req, res) {
        //Comprueba que el libro existe
        Book.findOne({bookId: req.params.bookId}, function (err, book) {
            if (err) {
                res.status(500).send("This book doesn't exist.");
            }
            if (book != null) {
                //Comprueba si el comentario existe en base de datos
                Comment.findOne({commentId: req.params.commentId}, function (err, comment) {
                    if (err) {
                        res.status(500).send("This comment doesn't exist.");
                    }
                    //Borra el comentario
                    if (comment != null) {
                        comment.delete(function (err, comment) {
                            if (err) {
                                res.status(500).send("Cannot delete comment");
                            }
                            res.status(200).jsonp(comment);
                        })
                    } else {
                        res.status(404).send("Comment at id " + req.params.commentId + " not found");
                    }
                })
            } else {
                res.status(404).send("Book at id " + req.params.bookId + " not found");
            }
        });
    });

module.exports = bookRouter;