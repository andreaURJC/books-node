const express = require('express');

const url = require("url");
const router = express.Router();

var testDB;
var bookCollection;

const books = new Map();
const comments = new Map();
let nextId = 1;
let nextCommentId = 1;

//GET books
router.get('/books', ((req, res) =>
        res.json([...books.values()])
));

//GET book by its id
router.get('/books/:id', (async (req, res) => {
        const bookId = req.params.id;
        const book = await Book.find({id: bookId}).exec();

        if (!book) {
            res.sendStatus(404);
        } else {
            // getComments(book.id)
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

//DELETE book at id -> Creo que esta operacion no se contemplaba en la otra practica.
router.delete('/books/:id', (req, res) => {
    const id = req.params.id;
    const book = books.get(id);

    if (!book) {
        res.sendStatus(404);
    } else {
        if (books.delete(id)) {
            res.sendStatus(200);
        } else {
            res.sendStatus(409)
        }
    }
});

//GET comments
router.get('/comments', ((req, res) =>
        res.json([...comments.values()])
));

//GET comment by its id
router.get('/comments/:id', ((req, res) => {
        const id = req.params.id;
        const comment = comments.get(id);

        if (!comment) {
            res.sendStatus(404);
        } else {
            res.json(comment);
        }
    }
));

//DELETE comment by its id
router.delete('/comments/:id', (req, res) => {
    const id = req.params.id;
    const comment = comments.get(id);

    if (!comment) {
        res.sendStatus(404);
    } else {
        if (comments.delete(id)) {
            res.sendStatus(200);
        } else {
            res.sendStatus(409)
        }
    }
});

//POST comment
router.post('/comments/:bookId', (req, res) => {
    if (books.has(req.params.bookId)) {
        if (!validComment(req.body)) {
            res.sendStatus(400);
        } else {
            let comment = {
                author: req.body.author,
                text: req.body.text,
                score: req.body.score,
            };

            addComment(comment, req.params.bookId);
            //TODO: revisar
            res.location(fullUrl(req));
            res.json(comment);
        }
    } else {
        res.sendStatus(400);
    }
});

function addBook(book) {
    let id = nextId++;
    book.id = id.toString();
    books.set(book.id, book);
}

// Validations:
function validBook(book) {
    return typeof book.title == 'string' && typeof book.summary == 'string' && typeof book.author == 'string';
}

function validComment(comment) {
    return typeof comment.author == 'string' && typeof comment.text == 'string' && typeof comment.score == 'number';
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

// Comments:
function addComment(comment, bookId) {
    let id = nextCommentId++;
    comment.id = id.toString();
    comment.bookId = bookId.toString();
    comments.set(comment.id, comment);
}

function getComments(bookId) {
    books.get(bookId).comments = [];
    comments.forEach((comment) => {
        if (comment.bookId === bookId) {
            books.get(bookId).comments.push(comment);
        }
    });
}

async function getBookById(bookId) {
    return bookCollection.find({id: bookId}).toArray();
}

function init() {
    addComment({
        author: 'Andrea',
        text: 'Me ha gustado mucho este libro.',
        score: 5
    }, 1);

    addComment({
        author: 'Juanma',
        text: 'Me ha parecido un rollo terrible.',
        score: 0
    }, 2);
}

module.exports = router;
