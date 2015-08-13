'use strict';
var utils = require('./utils.js');

var taskQueue, uuid = 0;
var statusText = [ 'pending', 'fulfilled', 'rejected' ];
var PENDING = 0, FULFILLED = 1, REJECTED = 2;

var isThenable = utils.isThenable;
var isFunction = utils.isFunction;
var nop = utils.nop;

// Tasks
taskQueue = {
    _queue: []
};
taskQueue.push = function (task) {
    var q = this._queue;
    if ((q.length === 0) && !this.flushing) {
        this.schedule();
    }
    q.push(task);
};
taskQueue.flush = function () {
    // During task execution new tasks could be queued
    var i, n, t, q;
    this.flushing = true;
    while (true) {
        q = this._queue;
        n = q.length;
        if (n === 0) {
            break;
        }
        this._queue = [];
        for (i = 0; i < n; ++i) {
            t = q[i];
            try {
                t();
            }
            catch (e) {
                // log
            }
        }
    }
    this.flushing = false;
};

taskQueue.initFlush = function () {
    var self = this;
    taskQueue.fnFlush = function () {
        self.flush();
    };
};
taskQueue.initFlush();

taskQueue.schedule = function () {
    process.nextTick(this.fnFlush);
};

function queueMicroTask(task) {
    taskQueue.push(task);
}

// Promise resolution
function promiseSettle(promise, status, result) {
    promise._value = result;
    promise._fulfillReactions = undefined;
    promise._rejectReactions = undefined;
    promise._status = status;
    promise._resolved = true;
}
function triggerPromiseReactions(reactions, result) {
    reactions.forEach(function (reaction) {
        queueMicroTask(function () {
            reaction(result);
        });
    });
}
function promiseFulfill(promise, value) {
    var reactions;
    reactions = promise._fulfillReactions;
    promiseSettle(promise, FULFILLED, value);
    triggerPromiseReactions(reactions, value);
}
function promiseReject(promise, reason) {
    var reactions;
    reactions = promise._rejectReactions;
    promiseSettle(promise, REJECTED, reason);
    triggerPromiseReactions(reactions, reason);
}
function promiseChain(p1, p2) {
    try {
        switch (p2._status) {
            case PENDING:
                p2._fulfillReactions.push(function (value) {
                    promiseFulfill(p1, value);
                });
                p2._rejectReactions.push(function (reason) {
                    promiseReject(p1, reason);
                });
                break;
            case FULFILLED:
                promiseFulfill(p1, p2._value);
                break;
            case REJECTED:
                promiseReject(p1, p2._value);
                break;
        }
    }
    catch (e) {
        promiseReject(p1, e);
    }
}
/*eslint-disable no-use-before-define */
function promiseResolve(promise, resolution) {
    var thenCalled;
    if (promise._resolved) {
        // promise has already been resolved
        return;
    }
    try {
        if (promise === resolution) {
            throw new TypeError('A promise cannot resolve to itself.');
        }
        promise._resolved = true; // lock promise
        if (resolution instanceof Promise) {
            promiseChain(promise, resolution);
        }
        else if (isThenable(resolution)) {
            // Handle thenable objects
            resolution.then(function (value) {
                if (!thenCalled) {
                    thenCalled = true;
                    promise._resolved = false;
                    promiseResolve(promise, value);
                }
            }, function (reason) {
                if (!thenCalled) {
                    thenCalled = true;
                    promise._resolved = false;
                    promiseReject(promise, reason);
                }
            });
        }
        else {
            // value
            promiseFulfill(promise, resolution);
        }
    }
    catch (e) {
        promiseReject(promise, e);
    }
}
/*eslint-enable no-use-before-define */

/**
 * Creates a new Promise
 * @param {function} executor Function object with two arguments resolve and reject. The resolve function that is passed to an executor function accepts a single argument. The executor code may eventually call the resolve function to indicate that it wishes to resolve the associated Promise object. The argument passed to the resolve function represents the eventual value of the deferred action and can be either the actual fulfillment value or another Promise or thenable object which will provide the value if it is fulfilled.
 The reject function that is passed to an executor function accepts a single argument. The executor code may eventually call the reject function to indicate that the associated Promise is rejected and will never be fulfilled. The argument passed to the reject function is used as the rejection value of the promise. Typically it will be an Error object.
 * @constructor
 */
function Promise(executor) {
    var self, resolve, reject;
    if (!(this instanceof Promise)) {
        throw new TypeError('Promise constructor is not intended to be called as a function.');
    }

    if (!isFunction(executor)) {
        throw new TypeError('Promise constructor takes a function argument.');
    }

    self = this;
    resolve = function (value) {
        promiseResolve(self, value);
    };
    reject = function (reason) {
        if (!self._resolved) {
            promiseReject(self, reason);
        }
    };
    this._id = ++uuid;
    this._status = PENDING;
    this._resolved = false;
    this._fulfillReactions = [];
    this._rejectReactions = [];
    try {
        executor(resolve, reject);
    }
    catch (e) {
        reject(e);
    }
}

/**
 * The Promise.prototype.then method returns a Promise. It takes two arguments, both are callback functions for the success and failure cases of the Promise.
 * If the invoked callback function returns a value, the then Promise will be fulfilled. If it throws an exception, the then Promise will be rejected.
 * @param {function} onFulfilled Function called when the Promise is fulfilled. This function has one argument, the fulfillment value.
 * @param {function} onRejected Function called when the Promise is rejected. This function has one argument, the rejection reason.
 * @returns {Promise}
 */
Promise.prototype.then = function (onFulfilled, onRejected) {
    var thenPromise, thisFulfilled, thisRejected, result;
    thenPromise = new Promise(nop);
    thisFulfilled = function (value) {
        try {
            if (isFunction(onFulfilled)) {
                promiseResolve(thenPromise, onFulfilled(value));
            }
            else {
                promiseFulfill(thenPromise, value);
            }
        }
        catch (e) {
            promiseReject(thenPromise, e);
        }
    };
    thisRejected = function (reason) {
        try {
            if (isFunction(onRejected)) {
                promiseResolve(thenPromise, onRejected(reason));
            }
            else {
                promiseReject(thenPromise, reason);
            }
        }
        catch (e) {
            promiseReject(thenPromise, e);
        }
    };
    switch (this._status) {
        case PENDING:
            this._fulfillReactions.push(thisFulfilled);
            this._rejectReactions.push(thisRejected);
            break;
        case FULFILLED:
            result = this._value;
            queueMicroTask(function () {
                thisFulfilled(result);
            });
            break;
        case REJECTED:
            result = this._value;
            queueMicroTask(function () {
                thisRejected(result);
            });
            break;
    }
    return thenPromise;
};
/**
 * The Promise.prototype.catch method returns a Promise and deals with rejected cases only. It behaves the same as calling Promise.prototype.then(undefined, onRejected).
 * @param {function} onRejected Function called when the Promise is rejected. This function has one argument, the rejection reason.
 * @returns {Promise}
 */
Promise.prototype.catch = function (onRejected) {
    return this.then(undefined, onRejected);
};

// Debug extensions
Object.defineProperties(Promise.prototype, {
    id: {
        get: function () {
            return this._id;
        }
    },
    result: {
        get: function () {
            return this._value;
        }
    },
    status: {
        get: function () {
            return this._status;
        }
    },
    statusText: {
        get: function () {
            return statusText[this._status];
        }
    },
    value: {
        get: function () {
            return this._value;
        }
    }
});

// Promise static methods
Object.defineProperties(Promise, {
    PENDING: { value: 0 },
    FULFILLED: { value: 1 },
    REJECTED: { value: 2 }
});

/**
 * The Promise.resolve function returns a Promise object that is resolved with the given value. If the value is a Promise, Promise.resolve returns the value itself. If the value is a thenable object (i.e. has a then method), the returned promise will "follow" that thenable, adopting its eventual state. Otherwise the returned promise will be fulfilled with the value.
 * @param {*} value
 * @returns {Promise}
 */
Promise.resolve = function (value) {
    if (value instanceof Promise) {
        return value;
    }
    return new Promise(function (resolve) {
        resolve(value);
    });
};
/**
 * The Promise.reject function returns a Promise object which is rejected with the given reason. While not mandatory, it is recommended to restrict reason to be an instance of Error.
 * @param {*} reason
 * @returns {Promise}
 */
Promise.reject = function (reason) {
    return new Promise(function (resolve, reject) {
        reject(reason);
    });
};
/**
 * The Promise.all function returns a new promise which is fulfilled with an array of fulfillment values for the passed values, or rejects with the reason of the first passed promise that rejects. It resolves all elements to promises as it runs this algorithm.
 * @param {Array} promises Array of promises or values. Currently, only Array is supported whereas it should be iterable according to EcmaScript 2015
 * @returns {Promise}
 */
Promise.all = function (promises) {
    var executor;
    if (!Array.isArray(promises)) {
        throw new TypeError('Promise.all requires an array argument.');
    }
    executor = function (resolve, reject) {
        var i, n, results, remaining, getResolver, resolveAt, promise;
        results = [];
        remaining = promises.length;
        if (remaining === 0) {
            resolve([]);
            return;
        }
        resolveAt = function (index, value) {
            results[index] = value;
            --remaining;
            if (remaining === 0) {
                resolve(results);
            }
        };
        getResolver = function (index) {
            return function (value) {
                resolveAt(index, value);
            };
        };
        n = remaining;
        for (i = 0; i < n; ++i) {
            promise = promises[i];
            try {
                if (isThenable(promise)) {
                    Promise.resolve(promise).then(getResolver(i), reject);
                }
                else {
                    resolveAt(i, promise);
                }
            }
            catch (e) {
                // isThenable may throw as it accesses promise.then property
                reject(e);
            }
        }
    };
    return new Promise(executor);
};
/**
 * The Promise.race function returns a new promise which is settled in the same way as the first passed promise to settle. It resolves all elements to promises as it runs this algorithm.
 * @param {Array} promises Array of promises or values. Currently, only Array is supported whereas it should be iterable according to EcmaScript 2015
 * @returns {Promise}
 */
Promise.race = function (promises) {
    var executor;
    if (!Array.isArray(promises)) {
        throw new TypeError('Promise.race requires an array argument.');
    }
    executor = function (resolve, reject) {
        var i, n, promise;
        n = promises.length;
        for (i = 0; i < n; ++i) {
            // Promise.race is settled by the first value to be settled (not simply resolved)
            //  => leverage Promise.prototype.then, thenable object must be casted into Promises as we cannot trust their then function
            promise = promises[i];
            try {
                if (isThenable(promise)) {
                    Promise.resolve(promise).then(resolve, reject);
                }
                else {
                    resolve(promise);
                }
            }
            catch (e) {
                // isThenable may throw as it accesses promise.then property
                reject(e);
            }
        }
    };
    return new Promise(executor);
};

module.exports = Promise;
