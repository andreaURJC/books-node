const express = require('express');
const mongoose = require('mongoose');

const bookRouter = require("./router/bookRouter.js");
const Book = require('./models/Book.js');
const Comment = require('./models/Comment.js');
const User = require('./models/User.js');

const app = express();
app.use(express.json());
app.use(bookRouter);

const mongoUrl = "mongodb://localhost:27017/";
mongoose.connect(mongoUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
}, function (err) {
    if (err) {
        console.log("Error: connecting to Database!" + err);
    }
    app.listen(3000, () => {
        console.log('App listening on port 3000');
        initSomeBooks()
    });
});

function initSomeBooks() {
    Book.create({
            bookId: 1,
            title: 'El Principito',
            summary: 'El principito es una novela corta y la obra más famosa del escritor y aviador francés Antoine de Saint-Exupéry',
            postYear: 1943,
            author: 'Antoine de Saint-Exupéry',
            publisher: "Anaya",
            comments: []
        });

    Book.create(
        {
            bookId: 2,
            title: 'Don Quijote de la Mancha',
            summary: 'Las andanzas de Don Quijote y Sancho Panza.',
            postYear: 1700,
            author: 'Miguel de Cervantes',
            publisher: 'Planeta',
            comments: []
        });

    Comment.create({
        bookId: 1,
        commentId: 1,
        user: "Andrea",
        text: "Me ha gustado mucho",
        score: 2
    });

    Comment.create({
        bookId: 2,
        commentId: 2,
        user: "Juanma",
        text: "Me ha gustado mucho, pero no lo recomiendo.",
        score: 5
    });

    User.create({
        id: 1,
        nick: "Andrea",
        email: "andrea@test.com"
    });

    User.create({
        id:2,
        nick: "Juanma",
        email: "juanma@test.com"
    });
}



