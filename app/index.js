const express = require('express');
const config = require('../configs');
const log = require('./logger');
const router = require('./middleware/router');

const app = express();
app.use(router);


app.listen(config.port);
log.debug('Express app started on port ' + config.port);

