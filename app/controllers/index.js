const Error = require('common').Error;
const errorCodes = require('common/data/errorCodes.json');

class Controller {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this._actions = this.actions || {};
    }

    callAction(name) {
        return new Promise((resolve) => {
            const action = this.getAction(name);
            resolve(action.call(this));
        });
    }

    getAction(name) {
        let result = this._actions[name];
        if (!result) {
            throw new Error(errorCodes.notFound, 'Action not found', {actionName: name});
        }
        return result;
    }

    before() {
        return new Promise((resolve) => {
            resolve();
        });
    }

    after(res) {
        return new Promise((resolve) => {
            resolve(res);
        });
    }
}

Controller.registerAction = function (name, fn) {
    this.prototype.actions = this.prototype.actions || {};
    this.prototype.actions[name] = fn;
    return this;
};

module.exports = Controller;