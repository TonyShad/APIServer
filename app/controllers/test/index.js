const Controller = require('../../controllers');

class TestController extends Controller {
	constructor(req) {
		super(req);
	}
}

TestController.registerAction('show', function(){
	return "hello world";
});

module.exports = TestController;