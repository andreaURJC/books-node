const comments = new Map();
let nextId = 1;

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


export function addComment(comment, bookId) {
    let id = nextId++;
    comment.id = id.toString();
    comment.bookId = bookId.toString();
    comments.set(comment.id, comment);
}

export function getComments(bookId) {
    comments.forEach((comment) => {
        if (comment.bookId === bookId) {
            return comment;
        }
    });
}


