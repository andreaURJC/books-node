const express = require('express');
const Comment = require('../models/Comment');
const User = require('../models/User.js');

var userRouter = express.Router();

userRouter.route('/users/:userId/comments')
    //GET comments of an user
    .get(function (req, res) {
        User.findOne({id: req.params.userId}, function (err, user) {
            if (err) {
                res.status(404).send("User not found");
            }
            if (user) {
                Comment.find({nick: user.nick}, function (err, comments) {
                    if (err) {
                        res.status(404).send("Comments not found");
                    } else {
                        res.status(200).jsonp({comments: comments.map(comment => {
                            return {
                                id: comment.commentId,
                                text: comment.text,
                                score: comment.score,
                                bookId: comment.bookId
                            }
                            })});
                    }
                });
            } else {
                res.status(404).send("User not found");
            }
        })
    });

userRouter.route('/users')
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

userRouter.route("/users/:nick")
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

userRouter.route("/users/:userId")
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
                Comment.find({nick:user.nick}, function (err, comments) {
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

module.exports = userRouter;