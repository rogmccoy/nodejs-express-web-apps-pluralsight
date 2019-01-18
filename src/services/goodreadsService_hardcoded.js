const axios = require('axios');
const xml2js = require('xml2js');
const debug = require('debug')('app:goodreadsService');
// this will convert xml to json
const parser = xml2js.Parser({ explicitArray: false });
function goodreadService() {
  function getBookById() {
    return new Promise((resolve, reject) => {
      axios.get('https://www.goodreads.com/book/show/656.xml?key=K1KsPB5NJW5o5jOqB2SguQ')
        .then((response) => {
          parser.parseString(response.data, (err, result) => {
            // debug(response.data);
            if (err) {
              debug(err);
            } else {
              debug(result);
              resolve(result.GoodreadsResponse.book);
            }
          });
        })
        .catch((error) => {
          reject(error);
          debug(error);
        });
    });
  }

  return { getBookById };
}

module.exports = goodreadService();

// function goodreadService() {
//   function getBookById() {
//     return new Promise((resolve, reject) => {
//       resolve({ description: 'our description' });
//     });
//   }

//   return { getBookById };
// }

// module.exports = goodreadService();
