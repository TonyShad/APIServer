const mongoose = require('mongoose');
const config = require('../../configs');
const log = require('../logger'); 
const Erorr = require('common').Error;

mongoose.connect(config.dburi);
const connection = mongoose.connection;

connection.on('error', function(err) {
	throw new Error(errorCodes.unknown, 'connection to database error');
});
connection.once('open', function() {
	log.debug("Database connection success");
	connection.db.listCollections()
    .next(function(err, collinfo) {
        if (collinfo) {
            log.debug(collinfo);
        }
    });

});

module.exports = connection;

