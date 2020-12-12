const express = require('express');
const mongoose = require('mongoose');
var bookController = require("./controllers/booksController.js")

const bookRouter = express.Router();
const app = express();

bookRouter.route('/books')
    .get(bookController.findAllBooks)
    .post(bookController.addBook);

bookRouter.route('/books/:bookId')
    .get(bookController.findById);

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
    });
});

// await Book.insertMany([
//     {
//         'id': 1,
//         'title': 'El Principito',
//         'summary': 'El principito es una novela corta y la obra más famosa del escritor y aviador francés Antoine de Saint-Exupéry',
//         'postYear': 1943,
//         'author': 'Antoine de Saint-Exupéry',
//         'comments': []
//     },
//     {
//         'id': 2,
//         'title': 'Don Quijote de la Mancha',
//         'summary': 'Las andanzas de Don Quijote y Sancho Panza.',
//         'postYear': 1700,
//         'author': 'Miguel de Cervantes',
//     }
// ], options);



