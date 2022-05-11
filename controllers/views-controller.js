exports.home = (request, response, next) => {
  let data = {
    html: {
      title: 'Playfab | Home page'
    }
  };
  response.render('home.ejs', data);
};