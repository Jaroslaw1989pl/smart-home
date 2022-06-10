// build-in modules
const express = require('express');
const session = require('express-session');
// custom modules
const config = require('./../app/config/config');


const app = express();

// parsing incoming requests with urlencoded payloads
app.use(express.urlencoded({extended: true}));
// the template engine to use
app.set('view engine', 'ejs');
// directory for the application views
app.set('views', 'public/views');
// built-in middleware function that serves static files
app.use(express.static(config.ROOT_DIR + '/public'));
// 
app.use(session({secret: '', name: 'sessionId', resave: false, saveUninitialized: false}));

// setting up local variables passed to all views
app.use((request, response, next) => {
  console.log(request);
  response.locals.isAuthenticated = request.session.isLoggedIn;
  response.locals.user = request.session.user;
  response.locals.flash = request.session.flash;
  request.session.flash = undefined;
  next();
});

// routes
app.use('/', require('./../router/router'));

app.listen(config.port, () => {
  console.log('HTTP Server listen on port ' + config.port);
});