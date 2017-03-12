const Router = require('express').Router;
const router = new Router();

function route(req, res, next, path, action) {
	const Controller = require('../controllers/' + path);
	const controller = new Controller(req);
	controller.callAction(action)
		.then((result) => {
            res.end(result);
        })
        .catch(next);
}

router.get('/test', (req, res, next) => route(req, res, next, 'test', 'show'));

module.exports = router;