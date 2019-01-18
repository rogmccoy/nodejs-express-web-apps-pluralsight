const express = require('express');

// const { MongoClient, ObjectID } = require('mongodb');

// const debug = require('debug')('app:bookRoutes');
const bookController = require('../controllers/bookController');
const bookService = require('../services/goodreadsService');

const bookRouter = express.Router();


// routes handle navigation on the web application and call functions from the controller
// getLibrary, getById, middleware are all functions in the controller
// the functions in the controller handle the actions of the web application
function router(nav) {
  // this goes to the controller and returns an object that contains the functions from the controller
  const { getLibrary, getById, middleware } = bookController(bookService, nav);
  // middleware checks to see if user is logged in
  bookRouter.use(middleware);
  // getLibrary returns all the books in the database
  bookRouter.route('/')
    .get(getLibrary);

  // getById returns the clicked on book from the db
  bookRouter.route('/:id')
    .get(getById);
  return bookRouter;
}

module.exports = router;
