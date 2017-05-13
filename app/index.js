const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const config = require('../configs');
const log = require('./logger');
const router = require('./middleware/router');
const fs = require('fs');
const join = require('path').join;
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.Promise = global.Promise;

const db = mongoose.connect(config.dburi);
const connection = db.connection;
const models = require("./models");

// app.use(session({
// 	secret: config.secret,
// 	resave: true,
//     saveUninitialized: true,
// 	store: new MongoStore({mongooseConnection: connection})
// }));

app.use(router);


app.listen(config.port, function(){
	log.debug("server listening");
});
log.debug('Express app started on port ' + config.port);

connection.on("error", function(){
	log.debug("DB connection error");

});
connection.once("open", function(){
	 log.debug("Connected to DB");
	
});
