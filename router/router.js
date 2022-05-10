// build-in modules
const express = require('express');
// custom modules
const views = require('./../controllers/views-controller');
const error = require('./../controllers/error-controller');
const auth = require('./../controllers/auth-controller');


const router = express.Router();

// public views routes
router.get('/', views.home);
router.get('/login', views.login);
router.get('/registration', views.registration);

// router.get('/test/:id', (request, response, next) => {
//   let data = {
//     pageTitle : 'Playfab | TEST'
//   };
//   response.render('home.ejs', data);
//   console.log('params', request.params); // :id
//   console.log('query', request.query);
// });

// user authentication routes
router.get('/registration-get-user-name', auth.getUserName);

// error views
router.use(error.notFound);

module.exports = router;