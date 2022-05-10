// custom modules
const Registration = require('./../models/registration-model');

exports.getUserName = (request, response, next) => {
  console.log('params', request.params); // :id
  console.log('query', request.query);

  const registration = new Registration();
  registration.getUserName(request.query.userName)
  .then(data => response.send(data))
  .catch(error => console.log(error));
};