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
	}
}

UserController.registerAction('getDecks', function(){
    sessionID = this.req.headers.sessionid;
    if(sessionID){
        return Session.findOne({session_id: sessionID})
            .then(function(session){
                if(session){
                    return User.findOne({_id: session.user_id})
                        .then(function(user) {
                            if(user){
                                return JSON.stringify(user.decks);
                            } else {
                                "User with this session id was not found";
                            }
                        });
                } else {
                    return "This session does not excist, please log in";
                }
            });
    } else {
        return "User is not authorized for this action";
    }
});

UserController.registerAction('createDeck', function(){
    const name = this.req.body.name;
    const sessionID = this.req.headers.sessionid;
    if(sessionID && name){
        return Session.findOne({session_id: sessionID})
            .then(function(session){
                if(session){
                    return User.findByIdAndUpdate(session.user_id,
                        {$push: {"decks": {name: name}}})
                        .then(function(result) {
                            log.debug(result);
                            return JSON.stringify(result);
                        });
                } else {
                    return "This session does not excist, please log in";
                }
            })
    } else {
        return "User is not authorized for this action";
    }      
    
});

module.exports = UserController;