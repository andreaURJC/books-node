const express = require('express');
const Book = require('../models/Book');
const Comment = require('../models/Comment');
const User = require('../models/User.js');

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

bookRouter.route('/comments/:user')
    //GET comments of an user
    .get(function (req, res) {
        Comment.find({user: req.params.user}, function (err, comments) {
            if (err) {
                res.status(404).send("Cannot find any comments");
            }
            if (comments.length === 0) {
                res.status(404).send("Cannot find any comments");
            } else {
                console.log('GET/comments/user')
                res.status(200).jsonp(comments);
            }
        });
    });

bookRouter.route("/books/:bookId/comments")
    //POST comment at bookId
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

                    User.findOne({nick: req.body.user}, function (err, user) {
                        if(err) {
                            res.status(404).send("This user doesn't exist.");
                        }
                        if(user) {
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
                Comment.findOne({bookId: req.params.commentId}, function (err, comment) {
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


bookRouter.route('/users')
    //GET users
    .get(function (req, res) {
        User.find(function (err, users) {
            if (err) {
                res.status(404).send("Cannot find any users");
            }
            console.log('GET/users/')
            res.status(200).jsonp(users);
        });
    })
    //POST new users
    .post(function (req, res) {
        User.findOne({nick: req.body.nick}, function (err, user) {
            if (err) {
                res.status(500).send("This book doesn't exist.");
            }

            if (!user) {
                User.countDocuments(function (err, count) {
                    if (err) {
                        console.log("Cannot count docs");
                    }
                    var userId = count + 1;
                    const user = new User({
                        id: userId,
                        nick: req.body.nick,
                        email: req.body.email,
                    });
                    user.save(function (err, user) {
                        if (err) {
                            res.status(500).send(err.message);
                        }
                        res.status(200).jsonp(user);
                    })
                })
            } else {
                res.status(500).send("This user already exists.");
            }
        });
    });

bookRouter.route("/users/:nick")
    .get(function (req, res) {
        User.findOne({nick: req.params.nick}, function (err, user) {
            if (err) {
                res.status(404).send("Bad request");
            }
            if (user) {
                res.status(200).jsonp(user);
            } else {
                res.status(404).send("User not found");
            }
        })
    });

bookRouter.route("/users/:userId")
    .patch(function (req, res) {
        User.findOneAndUpdate({id: req.params.userId}, {$set: {email: req.body.email}},function (err, user) {
            if (err) {
                res.status(404).send("Bad request");
            }
            if (user) {
                res.status(200).jsonp(user);
            } else {
                res.status(404).send("User not found");
            }
        })
    })
    .delete(function (req,res) {
        User.findOne({id: req.params.userId}, function (err, user) {
            if (err) {
                res.status(404).send("Bad request");
            }
            if (user) {
                Comment.find({user:user.nick}, function (err, comments) {
                    if(comments.length === 0) {
                        user.delete(function (err, user) {
                            if (err) {
                                res.status(500).send("Cannot delete this user");
                            }
                            res.status(200).send("User deleted:" + req.params.userId);
                        });
                    } else {
                        res.status(500).send("User has comments and cannot be deleted");
                    }
                })
            } else {
                res.status(404).send("User not found");
            }
        });
    });


module.exports = bookRouter;