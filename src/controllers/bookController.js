const { MongoClient, ObjectID } = require('mongodb');

const debug = require('debug')('app:bookController');

function bookController(bookService, nav) {
  function getLibrary(req, res) {
    const url = 'mongodb://localhost:27017';
    const dbName = 'libraryApp';

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected correctly to server');

        const db = client.db(dbName);

        // collection is kind of like a table...but not really??
        const col = await db.collection('books');

        const books = await col.find().toArray();
        res.render(
          'bookListView',
          {
            nav,
            title: 'Library',
            books
          }
        );
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());
  }
  function getById(req, res) {
    const { id } = req.params;
    const url = 'mongodb://localhost:27017';
    const dbName = 'libraryApp';

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected correctly to server');

        const db = client.db(dbName);

        // collection is kind of like a table...but not really??
        const col = await db.collection('books');

        const book = await col.findOne({ _id: new ObjectID(id) });
        debug(book);

        // bookId is hardcoded
        book.details = await bookService.getBookById(book.bookId);
        // debug(book.bookId, 'after book.detials');

        res.render(
          'bookView',
          {
            nav,
            title: 'Library',
            book
          }
        );
      } catch (err) {
        debug(err.stack);
      }
    }());
  }
  // check to see is there is a user session, a logged in user.
  // if req.user is true that means a user is logged in.
  function middleware(req, res, next) {
    // if (req.user) {
    next();
    // } else {
    //   res.redirect('/');
    // }
  }

  return {
    getLibrary,
    getById,
    middleware
  };
}

// bookController is an object containing the controller functions
module.exports = bookController;
