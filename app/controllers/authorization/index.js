const Controller = require('../../controllers');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Session = mongoose.model('Session');
const Error = require('common').Error;
const errorCodes = require('common/data/errorCodes.json');
const log = require('../../logger');


class AuthController extends Controller {
	constructor(req, res) {
		super(req, res);
	}
}

AuthController.registerAction('register', function(){
    console.log(this.req.body);
	const user = new User(this.req.body);
    // const session = this.req.session;
    return user.save()
        .then(function(model) {
            log.debug("user "+ model + " saved");
            const session = new Session({user_id: model._id});
            return session.save()
                .then(function(s){
                    log.debug(s);
                    return s.session_id;
                })
                .catch(function(err){
                    return "User created";
                })
        });
});

AuthController.registerAction('login', function(){
    const password = this.req.query.password;
    log.debug(password);
    return User.findOne({email: this.req.query.email})
        .then(function(user){
            if(user.authenticate(password)){
                const session = new Session({user_id: user._id});
                return session.save()
                    .then(function(s){
                        log.debug(s);
                        return s.session_id;
                    })
                    .catch(function(err){
                        log.debug(err);
                        return "auth fail";
                    })
            } else {
                return("Login or password is not valid");
            }
        })
        .catch(function(err){
            return "Login or password is not valid";
        });
    
});

AuthController.registerAction('logout', function(){
    const sessionID = this.req.headers.sessionid;
    log.debug("before if");
    if(sessionID) {
        log.debug("inside if");
        log.debug(sessionID);
        return Session.findOneAndRemove({session_id: sessionID})
            .then(function(session) {
                if(session){
                    return "User is now logged out";
                } else {
                    return "User is logged out";
                }
            });
    } else {
        log.debug("this shit is fucked up");
        return "User is logged out";
    }
});

module.exports = AuthController;