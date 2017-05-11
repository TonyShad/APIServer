const Controller = require('../../controllers');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Error = require('common').Error;
const errorCodes = require('common/data/errorCodes.json');
const log = require('../../logger');


class UserController extends Controller {
	constructor(req, res) {
		super(req, res);
	}
}

UserController.registerAction('register', function(){
	const user = new User(this.req.body);
    const session = this.req.session;
    return user.save()
        .then(function() {
            log.debug("user "+ user.email + " saved");
            this.res.writeHead("Saved to DB");
            return(session.id);
        });
    
});

UserController.registerAction('login', function(){
    const password = this.req.query.password;
    const session = this.req.session;
    const response = this.res;
    let cookie = [];
    console.log(session);
    log.debug(password);
    return User.findOne({email: this.req.query.email})
        .then(function(user){
            if(user.authenticate(password)){
                session.user_id = user.id;
                session.save(function(err) {
                    if(err){
                        log.debug("session save error: " + err);
                    }
                });
                // response.set('Set-Cookie', ['user_id='+user.id]);
                log.debug("auth done well");
                return(session.id);
            }
        });
    
});

UserController.registerAction('logout', function(){
    console.log(this.req.session);
    this.req.session.destroy();
    return("User logged out");

});

UserController.registerAction('getDecks', function(){
    console.log(this.req);
    if(!this.req.session.user_id) {
        log.debug('user is not logged in');
        return("Please log in");
    } else {
        return User.findOne({_id: this.req.session.user_id})
            .then(function(user) {
                log.debug(user);
                log.debug("there are your decks:");
                return JSON.stringify(user.decks);
                
            });
    
    }
});

UserController.registerAction('createDeck', function(){
    console.log(this.req.body.name);
    console.log(this.req.session);
    const name = this.req.body.name;
    if(!this.req.session.user_id) {
        log.debug('user is not logged in');
    } else {
        return User.findByIdAndUpdate(this.req.session.user_id,
            {$push: {"decks": {name: name}}})
            .then(function(result) {
                log.debug(result);
                return JSON.stringify(result);
            });
            
    }
});

module.exports = UserController;