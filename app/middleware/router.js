const Router = require('express').Router;
const router = new Router();

function route(req, res, next, path, action) {
	const Controller = require('../controllers/' + path);
	const controller = new Controller(req, res);
	controller.callAction(action)
		.then((result) => {
			res.end(result);
        })
        .catch(next);
}

router.get('/test', (req, res, next) => route(req, res, next, 'test', 'test'));
router.post('/registration', (req, res, next) => route(req, res, next, 'authorization', 'register'));
router.get('/login', (req, res, next) => route(req, res, next, 'authorization', 'login'));
router.get('/logout', (req, res, next) => route(req, res, next, 'authorization', 'logout'));
router.get('/user/decks', (req, res, next) => route(req, res, next, 'user', 'getDecks' ));
router.post('/user/decks', (req, res, next) => route(req, res, next, 'user', 'createDeck'));

module.exports = router;