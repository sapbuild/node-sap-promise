'use strict';
var expect = require('chai').expect;
var utils = require('../lib/utils.js');

function fnCall() {
    return utils.fnCall(arguments);
}
describe('utils', function () {
    function echoArgs() {
        var k, len = arguments.length;
        var result = [];
        for (k = 0; k < len; ++k) {
            result.push(arguments[k]);
        }
        return result;
    }
    describe('fnCall', function () {
        it('should enable making a function call from an arguments object', function () {
            expect(function () {
                fnCall();
            }).to.throw(TypeError);
            expect(fnCall(echoArgs)).to.deep.equal([]);
            expect(fnCall(echoArgs, 1)).to.deep.equal([ 1 ]);
            expect(fnCall(echoArgs, 1, 2)).to.deep.equal([ 1, 2 ]);
            expect(fnCall(echoArgs, 1, 2, 3)).to.deep.equal([ 1, 2, 3 ]);
            expect(fnCall(echoArgs, 1, 2, 3, 4)).to.deep.equal([ 1, 2, 3, 4 ]);
            expect(fnCall(echoArgs, 1, 2, 3, 4, 5)).to.deep.equal([ 1, 2, 3, 4, 5 ]);
        });

        it('should enable making an object method call from an arguments object', function () {
            var obj = {
                echoArgs: function () {
                    var k, len = arguments.length;
                    var result = [ this ];
                    for (k = 0; k < len; ++k) {
                        result.push(arguments[k]);
                    }
                    return result;
                }
            };
            expect(function () {
                fnCall(obj);
            }).to.throw(TypeError);

            expect(fnCall(obj, obj.echoArgs)[0]).to.equal(obj);
            expect(fnCall(obj, obj.echoArgs, 1).slice(1)).to.deep.equal([ 1 ]);
            expect(fnCall(obj, obj.echoArgs, 1, 2).slice(1)).to.deep.equal([ 1, 2 ]);
            expect(fnCall(obj, obj.echoArgs, 1, 2, 3).slice(1)).to.deep.equal([ 1, 2, 3 ]);
            expect(fnCall(obj, obj.echoArgs, 1, 2, 3, 4).slice(1)).to.deep.equal([ 1, 2, 3, 4 ]);
            expect(fnCall(obj, obj.echoArgs, 1, 2, 3, 4, 5).slice(1)).to.deep.equal([ 1, 2, 3, 4, 5 ]);

            expect(fnCall(obj, 'echoArgs')[0]).to.equal(obj);
            expect(fnCall(obj, 'echoArgs', 1).slice(1)).to.deep.equal([ 1 ]);
            expect(fnCall(obj, 'echoArgs', 1, 2).slice(1)).to.deep.equal([ 1, 2 ]);
            expect(fnCall(obj, 'echoArgs', 1, 2, 3).slice(1)).to.deep.equal([ 1, 2, 3 ]);
            expect(fnCall(obj, 'echoArgs', 1, 2, 3, 4).slice(1)).to.deep.equal([ 1, 2, 3, 4 ]);
            expect(fnCall(obj, 'echoArgs', 1, 2, 3, 4, 5).slice(1)).to.deep.equal([ 1, 2, 3, 4, 5 ]);
        });
    });

    describe('invoke', function () {
        it('requires at least 1 element in the arg parameter', function () {
            expect(function () {
                utils.invoke([]);
            }).to.throw(TypeError);
        });
        // it('requires a callback as second parameter', function () {
        //     expect(function () {
        //         utils.invoke([ function () {} ]);
        //     }).to.throw(TypeError);
        // });
    });

    describe('objectInvoke', function () {
        it('requires at least 1 element in the arg parameter', function () {
            expect(function () {
                utils.objectInvoke([]);
            }).to.throw(TypeError);
        });
        it('requires a callback as second parameter', function () {
            expect(function () {
                utils.objectInvoke([ {} ]);
            }).to.throw(TypeError);
            expect(function () {
                utils.objectInvoke([ {}, 42 ]);
            }).to.throw(TypeError);
        });
        it('requires a valid method to be passed', function () {
            expect(function () {
                utils.objectInvoke([ {}, 42 ], function () {});
            }).to.throw(TypeError);
        });
    });
});
