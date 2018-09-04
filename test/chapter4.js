// "use strict"

var _ = require('underscore');
var assert = require('assert');
var stampit = require('stampit');
//var define = require('define');


//new code to declare jQueryStatic after npm update
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);

describe('Chapter4 Functions', function () {
    //test case passes
    describe('The Module Pattern', function () {

        var myModule = (function () {
            return {
                hello: function hello() {
                    return 'Hello, world!';
                }
            };
        }());
        it('Module pattern', function () {
            assert.equal(myModule.hello(), 'Hello, world!');
            assert.ok(myModule.hello(), 'Module works.');
        });
    });
    /*
        //Gives error at .state() line 65
        describe('Use Stampit to define factory', function () {
    
            (function (exports) {
                'use strict';
                // Make sure local storage is supported.
                var ns = 'post',
                    supportsLocalStorage =
                        (typeof localStorage !== 'undefined')
                        && localStorage !== null,
                    storage,
                    storageInterface = stampit().methods({
                        save: function saveStorage() {
                            throw new Error('.save() method not implemented.');
                        }
                    }),
                    localStorageProvider = stampit
                        .compose(storageInterface)
                        .methods({
                            save: function saveLocal() {
                                localStorage.storage = JSON.stringify(storage);
                            }
                        }),
                    cookieProvider = stampit
                        .compose(storageInterface)
                        .methods({
                            save: function saveCookie() {
                                $.cookie('storage', JSON.stringify(storage));
                            }
                        }),
                    post = stampit().methods({
                        save: function save() {
                            storage[this.id] = this.data;   // Need to discuss Stampit chains with Brent for this function
                            storage.save();
                            return this;
                        },
                        set: function set(name, value) {
                            this.data[name] = value;
                            return this;
                        }
                    })
                        .state({
                            data: {
                                message: '',
                                published: false
                            },
                            id: undefined
                        })
                        .enclose(function init() {
                            this.id = generateUUID();
                            return this;
                        }),
                    api = post;
                storage = (supportsLocalStorage)
                    ? localStorageProvider()
                    : cookieProvider();
                exports[ns] = api;
            }((typeof exports === 'undefined')
                ? window
                : exports
            ));
            $(function () {
                'use strict';
                var myPost = post().set('message', 'Hello, world!');
                it('Interface example', function () {
                    var storedMessage,
                        storage;
                    myPost.save();
                    storage = JSON.parse(localStorage.storage);
                    storedMessage = storage[myPost.id].message;
                    assert.equal(storedMessage, 'Hello, world!',
                        '.save() method should save post.');
                });
            });
        });
    */
    //Gives error at the moment line 110 because of jQueryStatic $
    describe('Pass application object as export', function () {

        var app = {};
        (function (exports) {
            (function (exports) {
                var api = {
                    moduleExists: function it() {
                        return true;
                    }
                };
                $.extend(exports, api);
            }((typeof exports === 'undefined') ?
                window : exports));
        }(app));
        it('Pass app as exports.', function () {
            assert.ok(app.moduleExists(),
                'The module exists.');
        });

    });
    /*
    describe('Anonymous module', function () {

        define(['ch04/amd1', 'ch04/amd2'], //need to find/create modules to put inside here
            function myModule(amd1, amd2) {
                var testResults = {
                    test1: amd1.test(),
                    test2: amd2.test()
                },
                    // Define a public API for your module:
                    api = {
                        testResults: function () {
                            return testResults;
                        }
                    };
                return api;
            });
        //To kick it off, call require()
        require(['ch04-amd'], function (amd) { //refer back to line 125
            var results = amd.testResults();
            it('AMD with Require.js', function () {
                assert.equal(results.test1, true,
                    'First dependency loaded correctly.');
                assert.equal(results.test2, true,
                    'Second dependency loaded correctly.');
            });
        });
    });
    */
    /*
        describe('Flatiron', function () {
    
            var flatiron = require('flatiron'),
            app = flatiron.app;
           app.use(flatiron.plugins.http, {
            // HTTP options
           });
           //
           // app.router is now available. app[HTTP-VERB] is also available
           // as a shortcut for creating routes
           //
           app.router.get('/version', function () {
            this.res.writeHead(200, { 'Content-Type': 'text/plain' })
            this.res.end('flatiron ' + flatiron.version);
           });
           app.start(8080);
           
        });*/

});
