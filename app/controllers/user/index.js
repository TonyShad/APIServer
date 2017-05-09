const Controller = require('../../controllers');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Error = require('common').Error;
const errorCodes = require('common/data/errorCodes.json');
const log = require('../../logger');


class UserController extends Controller {
	constructor(req) {
		super(req);
	}
}

UserController.registerAction('register', function(){
    console.log(this.req.body);
	const user = new User(this.req.body);
    try {
        console.log(user);
        user.save(function (err) {
            if (err) log.debug(err);
            console.log('SAVED1');
        });
        return "Saved to DB";
    } catch (err) {
        console.log(err);
        const errors = Object.keys(err.errors)
                .map(field => err.errors[field].message);
        return err;
    }
});

UserController.registerAction('login', function(){
    console.log(this.req.query);
    const password = this.req.query.password;
    const session = this.req.session;
    let cookie = [];
    log.debug("session: " + session);
    log.debug(password);
    User.findOne({email: this.req.query.email}, function(err, user){
        log.debug("user is:");
        console.log(user);
        if(err){ 
            console.log(err);
            return err;
        } else {
            try {
                if(user.authenticate(password)){
                    session.user_id = user.id;
                    session.save(function(err) {
                        if(err){
                            log.debug("session save error: " + err);
                        }
                    });
                    log.debug("auth done well");
                    log.debug(session);
                    cookie = {name: 'Set-Cookie', value: 'user_id='+user.id};
                    return({header: cookie});
                } else {
                    throw new Error(errorCodes.notFound, 'User not found', {actionName: 'login'});
                }
            } catch (err){
                console.log(err);
                return err;
            }
        }
    });
    
});

UserController.registerAction('logout', function(){
    console.log(this.req.session);
    this.req.session.destroy();
});

UserController.registerAction('getDecks', function(){
    log.debug(this.req.session);
    if(!this.req.session.user_id) {
        log.debug('user is not logged in');
    } else {
        User.findOne({_id: this.req.session.user_id}, function(err, user){
            log.debug(err);
            log.debug(user);
            if(err) {
                return err;
            } else {
                log.debug("there are your decks:");
                return user.decks;
            }
        });
    }
});

UserController.registerAction('createDeck', function(){
    if(!this.req.session.user_id) {
        log.debug('user is not logged in');
    } else {
        User.findByIdAndUpdate(
            this.req.session.user_id,
            {$push: {"decks": {name: this.req.body.name}}},
            {safe: true, upsert: true},
            function(err, model) {
                if(err) return err;
                return model;
            }
        );
    }
});

module.exports = UserController;