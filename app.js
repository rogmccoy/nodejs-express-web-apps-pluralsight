const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const sql = require('mssql');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// an instance of express
const app = express();
const port = process.env.PORT || 3000;

// this config is used with sql connection
const config = {
  user: 'library',
  password: 'L1brary1',
  server: 'pslibrary-roger.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
  database: 'PSLibrary',
  options: {
    encrypt: true // Use this if you're on Windows Azure
  }
};

sql.connect(config).catch(err => debug(err));

// morgan is an HTTP request logger
app.use(morgan('tiny'));
// app.use(morgan('combined'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'library' }));

require('./src/config/passport.js')(app);

// this is for serving static files
app.use(express.static(path.join(__dirname, '/public/')));
// tell the app where additional directories for css and js files
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));

// setting the views directory location
app.set('views', './src/views');
app.set('view engine', 'ejs');
// app.set('view engine', 'pug');

const nav = [
  { link: '/books', title: 'Books' },
  { link: '/authors', title: 'Author' }
];

const bookRouter = require('./src/routes/bookRoutes')(nav);
// if request comes into to books send to bookRouter
app.use('/books', bookRouter);

const adminRouter = require('./src/routes/adminRoutes')(nav);
// if request comes into to admin send to adminRouter
app.use('/admin', adminRouter);

const authRouter = require('./src/routes/authRoutes')(nav);
// if request comes into to auth send to authRouter
app.use('/auth', authRouter);


// this responds to get request to the root and will pull from the view directory that was set above
app.get('/', (req, res) => {
  // res.send('Hello from my library app');
  // res.sendFile(path.join(__dirname, 'views/index.html'));
  res.render('index',
    {
      nav: [{ link: '/books', title: 'Books' },
        { link: '/authors', title: 'Authors' }],
      title: 'Library'
    });
});
app.listen(port, () => {
  debug(`listening on port ${chalk.green(port)}`);
});
