// build-in modules
const express = require('express');
// custom modules
const config = require('../app/config/config');


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'public/views');

app.use(express.static(config.ROOT_DIR + '/public'));

app.use('/', require('./../router/router'));

app.listen(config.port, () => {
  console.log('HTTP Server listen on port ' + config.port);
});