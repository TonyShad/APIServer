let result;

switch (process.env.NODE_ENV) {
	default: 
		result = require('./development');
}

module.exports = result;