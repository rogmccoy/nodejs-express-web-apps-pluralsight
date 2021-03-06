const express = require('express');

const bookRouter = express.Router();
const sql = require('mssql');
const debug = require('debug')('app:bookRoutes');

function router(nav) {
  const books = [
    {
      title: 'War and Peace',
      genre: 'Historical Fiction',
      author: 'Lev Nikolayevich Tolstoy',
      read: false
    },
    {
      title: 'Les Misérables',
      genre: 'Historical Fiction',
      author: 'Victor Hugo',
      read: false
    },
    {
      title: 'The Time Machine',
      genre: 'Science Fiction',
      author: 'H. G. Wells',
      read: false
    },
    {
      title: 'A Journey into the Center of the Earth',
      genre: 'Science Fiction',
      author: 'Jules Verne',
      read: false
    },
    {
      title: 'The Dark World',
      genre: 'Fantasy',
      author: 'Henry Kuttner',
      read: false
    },
    {
      title: 'The Wind in the Willows',
      genre: 'Fantasy',
      author: 'Kenneth Grahame',
      read: false
    },
    {
      title: 'Life On The Mississippi',
      genre: 'History',
      author: 'Mark Twain',
      read: false
    },
    {
      title: 'Childhood',
      genre: 'Biography',
      author: 'Lev Nikolayevich Tolstoy',
      read: false
    }];

  bookRouter.route('/')
    .get((req, res) => {
      (async function query() {
        const request = new sql.Request();
        const { recordset } = await request.query('select * from books');
        // debug(result);
        // we set our views directory in app.js.  we are telling it which view to render.
        res.render('bookListView',
          {
            nav,
            title: 'Library',
            books: recordset
          });
      }());
    });

  bookRouter.route('/:id')
    .all((req, res, next) => {
      (async function query() {
        // req.params is an object passed from the view, it is the index of the books array.
        // the property id gets set in the bookRouter.route() function.
        // the const id variable is equal to the value of the id property, this is object destructuring
        const { id } = req.params;
        const request = new sql.Request();
        const { recordset } = await request.input('id', sql.Int, id)
          .query('select * from books where id = @id');
        [req.book] = recordset;
        // req.book = recordset[0]; //this is the same as the above code
        next();
        // debug(recordset);
        // we set our views directory in app.js. we are telling it which view to render.
      }());
    })
    .get((req, res) => {
      res.render('bookView',
        {
          nav,
          title: 'Library',
          book: req.book
        });
    });

  return bookRouter;
}

module.exports = router;
