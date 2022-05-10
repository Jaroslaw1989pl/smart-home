// build-in modules
const express = require('express');
// custom modules
const views = require('./../controllers/views-controller');
const error = require('./../controllers/error-controller');
const auth = require('./../controllers/auth-controller');


const router = express.Router();

// public views routes
router.get('/', views.home);

// user authentication routes
router.route('/login').get(auth.loginForm).post();
router.route('/registration').get(auth.registrationForm).post(auth.addUser);
router.route('/registration-get-user-name').get(auth.getUserName).post();
router.route('/registration-get-user-email').get(auth.getUserEmail).post();

// router.get('/test/:id', (request, response, next) => {
//   let data = {
//     pageTitle : 'Playfab | TEST'
//   };
//   response.render('home.ejs', data);
//   console.log('params', request.params); // :id
//   console.log('query', request.query);
// });

// error views
router.use(error.notFound);

module.exports = router;