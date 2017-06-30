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
	const user = new User(this.req.query);
    console.log(this.req.query);
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
        })
        .catch(function(error) {
            let errors = error.errors;
            for(let field in errors) {
                throw new Error(errorCodes.authFail, errors[field].message, {actionName: "register"});
            }
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
                        throw new Error(errorCodes.authFail, err.message, {actionName: "login"});
                    })
            } else {
                throw new Error(errorCodes.authFail, 'User not found', {actionName: "login"});
            }
        })
        .catch(function(err){
            throw new Error(errorCodes.authFail, 'User not found', {actionName: "login"});
        });
    
});

AuthController.registerAction('logout', function(){
    const sessionID = this.req.headers.sessionid;
    if(sessionID) {
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
        return "User is logged out";
    }
});

module.exports = AuthController;