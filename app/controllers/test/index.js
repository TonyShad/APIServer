const Controller = require('../../controllers');
const mongoose = require('mongoose');
const Test = mongoose.model('Test');
const Error = require('common').Error;
const errorCodes = require('common/data/errorCodes.json');
const log = require('../../logger');

class TestController extends Controller {
	constructor(req) {
		super(req);
	}
}

TestController.registerAction('test', function(){
	console.log(this.req.body);
    log.debug(this.req.session);
    return "Test Done";
});

module.exports = TestController;