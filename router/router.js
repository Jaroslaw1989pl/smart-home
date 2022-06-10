// build-in modules
const express = require('express');
// custom modules
const { protected } = require('./../middleware/auth');
const views = require('./../controllers/views-controller');
const auth = require('./../controllers/auth-controller');
const settings = require('./../controllers/settings-controller');
const error = require('./../controllers/error-controller');


const router = express.Router();

// public views routes
router.get('/', views.home);
router.get('/games', views.games);
router.get('/games/checkers', views.gamesCheckers);

// user authentication routes
router.route('/login').get(views.loginForm).post(auth.login);

router.route('/registration').get(views.registrationForm).post(auth.registration);
router.route('/registration-get-user-name').get(auth.findUserName).post();
router.route('/registration-get-user-email').get(auth.findUserEmail).post();

router.route('/reset-password').get(views.resetPassword).post(auth.resetPassword);
router.route('/reset-password/:token').get(views.newPassword).post();
router.route('/new-password').get().post(auth.newPassword);

// user profile routes - protected routes
router.route('/profile-settings').get(protected, views.profileSettings).post();
router.route('/profile-avatar').get().post(settings.profileAvatar);
router.route('/profile-name').get(protected, views.profileName).post(settings.profileName);
router.route('/profile-birthday').get(protected, views.profileBirthday).post(settings.profileBirthday);
router.route('/profile-email').get(protected, views.profileEmail).post(settings.profileEmail);
router.route('/profile-password').get(protected, views.profilePassword).post(settings.profilePassword);

router.route('/profile-delete').get(protected, views.profileDelete).post(auth.delete);

router.route('/logout').get().post(auth.logout);

// error views
router.use(error.notFound);

module.exports = router;