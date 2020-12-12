const express = require('express');
const mongoose = require('mongoose');

const bookRouter = require("./router/bookRouter.js");
const Book = require('./models/Book.js');

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
    Book.create(
        {
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
}



