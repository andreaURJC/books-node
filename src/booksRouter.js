const express = require('express');
// import {addComment, getComments} from "./commentsService.js";

const url = require("url");
const router = express.Router();

const books = new Map();
let nextId = 1;

addBook({
    title: 'Don Quijote de la Mancha',
    summary: 'Las andanzas de Don Quijote y Sancho Panza.',
    postYear: 1700,
    author: 'Miguel de Cervantes',
    comments: []
})
addBook({
    title: 'El principito',
    summary: 'El principito es una novela corta y la obra más famosa del escritor y aviador francés Antoine de Saint-Exupéry',
    postYear: 1943,
    author: 'Antoine de Saint-Exupéry',
    comments: []
})

//GET books
router.get('/books', ((req, res) =>
        res.json([...books.values()])
));

//GET book by its id
router.get('/books/:id', ((req, res) => {
        const id = req.params.id;
        const book = books.get(id);

        if(!book) {
            res.sendStatus(404);
        } else {
            // book.comments = getComments(book.id)
            res.json(book);
        }
    }
));

//POST book - create new book
router.post('/books', (req, res) => {
    if (!validBook(req.body)) {
        res.sendStatus(400);
    } else {
        let book = {
            title: req.body.title,
            summary: req.body.summary,
            author: req.body.author
        };

        addBook(book);
        res.location(fullUrl(req));
        res.json(book);
    }
});

router.delete('/books/:id', (req, res) => {
    const id = req.params.id;
    const book = books.get(id);

    if(!book) {
        res.sendStatus(404);
    } else {
        if(books.delete(id)) {
            res.sendStatus(200);
        } else {
            res.sendStatus(409)
        }
    }
});

function addBook(book) {
    let id = nextId++;
    book.id = id.toString();
    books.set(book.id, book);
}

function validBook(book) {
    return typeof book.title == 'string' && typeof book.summary == 'string' && typeof book.author == 'string';
}

function fullUrl(req) {
    const fullUrl = url.format({
        protocol: req.protocol,
        host: req.get('host'),
        pathname: req.originalUrl
    });
    return fullUrl +
        (fullUrl.endsWith('/') ? '' : '/');
}

module.exports = router;
