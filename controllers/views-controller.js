let data = {
  html: {
    title: ''
  }
}

exports.home = (request, response, next) => {
  data.html.title = 'Playfab | Home page';
  response.render('home.ejs', data);
};