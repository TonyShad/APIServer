const Controller = require('../../controllers');
const mongoose = require('mongoose');
const Card = mongoose.model('Card');
const Session = mongoose.model('Session');
const Error = require('common').Error;
const errorCodes = require('common/data/errorCodes.json');
const log = require('../../logger');


class CardController extends Controller {
	constructor(req, res) {
		super(req, res);
        this.session = this.session || {};
	}
}
