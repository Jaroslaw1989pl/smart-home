exports.notFound = (request, response, next) => {
  let data = {
    pageTitle : 'Playfab | 404'
  };
  response.status(404).render('404-not-found.ejs', data);
};