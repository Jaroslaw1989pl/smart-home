exports.home = (request, response, next) => {
  let data = {
    pageTitle : 'Playfab | Home page'
  };
  response.render('home.ejs', data);
};

exports.login = (request, response, next) => {
  let data = {
    pageTitle : 'Playfab | Sign in'
  };
  response.render('auth-login.ejs', data);
};

exports.registration = (request, response, next) => {
  let data = {
    pageTitle : 'Playfab | Sign up'
  };
  response.render('auth-registration.ejs', data);
};