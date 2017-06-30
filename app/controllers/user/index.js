const Controller = require('../../controllers');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Session = mongoose.model('Session');
const Error = require('common').Error;
const errorCodes = require('common/data/errorCodes.json');
const log = require('../../logger');


class UserController extends Controller {
	constructor(req, res) {
		super(req, res);
        this.session = this.session || {};
	}
}

UserController.prototype.before = function(){
    const sessionID = this.req.headers.sessionid;
    const req = this.req;
    if(sessionID) {
        return Session.findOne({session_id: sessionID})
            .then(function(session){
                if(session){
                    req.session = session;
                    return "Authorization complete";
                } else {
                    throw new Error(errorCodes.noAuth, 'User not authorized', {action: "userController.before"});
                }
            });
    } else {
        throw new Error(errorCodes.noAuth, 'User not authorized', {action: "userController.before"});
    }
}


UserController.prototype.userHasCards = function(cards) {
    const session = this.req.session;
    return User.findOne({_id: session.user_id})
        .then(function(user) {
            if(!user){
                throw new Error(errorCodes.authFail, 'User not found', {action: "userController.userHasCards"});
            } else {
                for(let card of cards){
                    let found = false;
                    for(let userCard of user.cards){
                        console.log(card, userCard);
                        if(card._id == userCard._id) found = true;
                    }
                    if(!found) {
                        throw new Error(errorCodes.unknown, 'User has no such card',
                                         {action: "userController.userHasCards"});
                    }
                }
                return cards;
            }
        });
}


UserController.prototype.formatCards = function(query) {
    let res = [];
    if(Array.isArray(query)){
        for(let card of query) {
            res.push({"_id": card});
        }
    } else {
        res.push({"_id": query});
    }
    return res;
}

UserController.registerAction('getDecks', function(){
    const session = this.req.session;
    return User.findOne({_id: session.user_id})
        .then(function(user) {
            if(user){
                return JSON.stringify(user.decks);
            } else {
                throw new Error(errorCodes.authFail, 'User not found', {action: "userController.getDecks"});
            }
        }); 
});



UserController.registerAction('createDeck', function(){
    const name = this.req.query.name;
    const session = this.req.session;
    let cards = this.req.query.cards;
    cards = this.formatCards(cards);
    return this.userHasCards(cards)
        .then((cards) => {
            return User.findByIdAndUpdate(session.user_id,
            {$push: {"decks": {"name": name, "cards": cards}}})
        })
        .then(function(result) {
            log.debug(result);
            if(result){
                return JSON.stringify(result);
            } else {
                throw new Error(errorCodes.authFail, 'User not found', {action: "userController.getDecks"});
            }
        }); 
});

UserController.registerAction('changeDeck', function(){
    log.debug("PADLO");
    console.log(this.req.query);
    let cards = this.req.query.cards;
    cards = this.formatCards(cards);
    const deckID = this.req.query.deckID;
    const userID = this.req.session.user_id;
    const deckName = this.req.query.deckName;
    return User.findOneAndUpdate(
        {"decks":{$elemMatch: {"_id": deckID}}},
        {$set: {"decks.$.cards": cards, "decks.$.name": "SRAKA"}})
            .then(function(result) {
                return "Deck " + deckID + " was updated";
            })
            .catch(function(err) {
                throw new Error(errorCodes.unknown, err.message, {action: "changeDeck"});
            });
});

UserController.registerAction('deleteDeck', function(){
    log.debug("PADLO");
    console.log(this.req.params.deckID);
    const deckID = this.req.params.deckID;
    const userID = this.req.session.user_id;
    console.log(this.req.session.user_id);
    return User.findByIdAndUpdate(userID, {$pull: {"decks": {"_id": deckID} }})
            .then(function(result) {
                return "Deck " + deckID + " was removed";
            });
});


UserController.registerAction('addToCollection', function(){
    const session = this.req.session;
    let cards = this.req.query.cards;
    console.log(cards);
    cards = this.formatCards(cards);
    console.log(cards);

    return User.findOneAndUpdate(
        {"_id": session.user_id},
        {$pushAll: {"cards": cards}})
    .then(function(result){
        return "Added cards: " + cards + " to user";
    });
      
});

module.exports = UserController;