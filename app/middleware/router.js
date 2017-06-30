const Router = require('express').Router;
const router = new Router();

function route(req, res, next, path, action) {
	const Controller = require('../controllers/' + path);
	const controller = new Controller(req, res);
	controller.before()
		.then((result) => {
			console.log("SRAKA");
			console.log(result);
			return controller.callAction(action);
		})
		.then((result) => {
			return controller.after(result);
		})
		.then((result) => {
			res.end(result);
		})
		.catch((result) => {
			next(`Error in action: "${result._data.actionName}" with message: ${result._message}`);
			return result;
		});
}

router.get('/test', (req, res, next) => route(req, res, next, 'test', 'test'));
router.post('/registration', (req, res, next) => route(req, res, next, 'authorization', 'register'));
router.get('/login', (req, res, next) => route(req, res, next, 'authorization', 'login'));
router.get('/logout', (req, res, next) => route(req, res, next, 'authorization', 'logout'));
router.get('/user/decks', (req, res, next) => route(req, res, next, 'user', 'getDecks' ));
router.post('/user/decks', (req, res, next) => route(req, res, next, 'user', 'createDeck'));
router.put('/user/decks/:deckID', (req, res, next) => route(req, res, next, 'user', 'changeDeck'));
router.delete('/user/decks/:deckID', (req, res, next) => route(req, res, next, 'user', 'deleteDeck'));
router.get('/user/collection', (req, res, next) => route(req, res, next, 'user', 'getCollection'));
router.post('/user/collection', (req, res, next) => route(req, res, next, 'user', 'addToCollection'));

module.exports = router;