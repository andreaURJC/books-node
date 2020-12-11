const express = require('express');
const bookRouter = require('./booksRouter.js');

const app = express();

app.use(express.json());
app.use(bookRouter);

app.listen(3000, () => {
    console.log('App listening on port 3000');
});
