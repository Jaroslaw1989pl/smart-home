exports.protected = (request, response, next) => {
  if (request.session.isLoggedIn) next();
  else response.redirect('/login');
};