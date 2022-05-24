// build-in modules
const express = require('express');
const session = require('express-session');
const multer = require('multer');
// custom modules
const config = require('../app/config/config');


const app = express();

// parsing incoming requests with urlencoded payloads
app.use(express.urlencoded({extended: true}));
// the template engine to use
app.set('view engine', 'ejs');
// directory for the application views
app.set('views', 'public/views');
// using muter for file upload
app.use(multer().single('image'));
// built-in middleware function that serves static files
app.use(express.static(config.ROOT_DIR + '/public'));
// 
app.use(session({secret: 'ks12256', name: 'sessionId', resave: false, saveUninitialized: false}));

// setting up local variables passed to all views
app.use((request, response, next) => {
  response.locals.isAuthenticated = request.session.isLoggedIn;
  response.locals.user = request.session.user;
  // console.log(response.locals);
  // console.log(request.session);
  // console.log('=====================');
  next();
});

// routes
app.use('/', require('./../router/router'));

app.listen(config.port, () => {
  console.log('HTTP Server listen on port ' + config.port);
});