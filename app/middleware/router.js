const Router = require('express').Router;
const router = new Router();

function route(req, res, next, path, action) {
	const Controller = require('../controllers/' + path);
	const controller = new Controller(req);
	controller.callAction(action)
		.then((result) => {
			console.log("then");
			console.log(result);
			res.append('Set-Cookie', ['ochko=jopa']);
			res.end(result);
        })
        .catch(next);
}

router.get('/test', (req, res, next) => route(req, res, next, 'test', 'test'));
router.post('/registration', (req, res, next) => route(req, res, next, 'user', 'register'));
router.get('/login', (req, res, next) => route(req, res, next, 'user', 'login'));
router.get('/logout', (req, res, next) => route(req, res, next, 'user', 'logout'));
router.get('/user/decks', (req, res, next) => route(req, res, next, 'user', 'getDecks' ));
router.post('/user/decks', (req, res, next) => route(req, res, next, 'user', 'createDeck'));

module.exports = router;