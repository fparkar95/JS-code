// var $ = require("jquery");
var assert = require('assert');

describe('Chapter2 Functions', function () {
    describe('Order WITH unintentional side effect.', function () {
        var cartProto = {
            items: [],

            addItem: function addItem(item) {
                this.items.push(item);
            }
        },

            createCart = function (items) {
                var cart = Object.create(cartProto);
                cart.items = items;
                return cart;
            },

            // Load cart with stored items.
            savedCart = createCart(["apple", "pear", "orange"]),

            session = {
                get: function get() {
                    return this.cart;
                },

                // Grab the saved cart.
                cart: createCart(savedCart.items)
            };

        // addItem gets triggered by an event handler somewhere:
        session.cart.addItem('grapefruit');

        it('Passes: Session cart has grapefruit.', function () {
            assert.notEqual(session.cart.items.indexOf('grapefruit'), -1);
        });

        it('Fails: The stored cart is unchanged.', function () {
            assert.notEqual(savedCart.items.indexOf('grapefruit'), -1);
        });
    });

    describe('Order WITH no side effects', function () {
        var cartProto = {
            items: [],

            addItem: function addItem(item) {
                this.items.push(item);
            }
        },

            createCart = function (items) {
                var cart = Object.create(cartProto);
                cart.items = Object.create(items);;
                return cart;
            },

            // Load cart with stored items.
            savedCart = createCart(["apple", "pear", "orange"]),

            session = {
                get: function get() {
                    return this.cart;
                },

                // Grab the saved cart.
                cart: createCart(savedCart.items)
            };

        // addItem gets triggered by an event handler somewhere:
        session.cart.addItem('grapefruit');

        it('Passes: Session cart has grapefruit.', function () {
            assert.notEqual(session.cart.items.indexOf('grapefruit'), -1);
        });

        it('Fails: The stored cart is unchanged.', function () {
            assert.equal(savedCart.items.indexOf('grapefruit'), -1);
        });
    });

    describe('Argument callee', function () {
        function foo() {
            /*  Warning: arguments.callee is deprecated.
                Use with caution. Used here strictly for
                illustration. */

            return arguments.callee;
        }

        it('foo(); //=> [Function: foo]', function () {
            assert.equal(foo(), foo);
        });
    });

    describe('conditional function definition', function () {
        var score = 6;

        if (score > 5) {
            function grade() {
                return 'pass';
            }
        } else {
            function grade() {
                return 'fail';
            }
        }

        // this pattern fails inconsistently across browsers
        it('grade returns pass', function () {
            assert.equal(grade(), 'pass');
        });
    });

    describe('anonymous functions', function () {
        var lightBulbAPI = {
            toggle: function () { },
            getState: function () { },
            off: function () { },
            on: function () { },
            blink: function () { }
        };

        it('anoymous function', function () {
            var value = typeof lightBulbAPI.toggle;
            assert.equal(typeof lightBulbAPI.toggle, "function");
        });
    });


    describe('named functions', function () {
        var lightBulbAPI = {
            toggle: function toggle() { },
            getState: function getState() { },
            off: function off() { },
            on: function on() { },
            blink: function blink() { }
        };

        it('named function', function () {
            var value = typeof lightBulbAPI.toggle;
            assert.equal(typeof lightBulbAPI.toggle, "function");
        });
    });

    describe('Named function expressions', function () {
        var exceptionThrown = false;

        // Named function expressions are not the same as function declarations
        var a = function x(count) {
            if (count > 0) {
                x(count - 1); // x() is usable inside the function.
            }
        };

        a(1);   // the variable a() is available but;

        try {
            x(1);  // x() is not usable outside the function.
        } catch (e) {
            exceptionThrown = true;
        }

        it('x() is undefined outside the function', function () {
            assert.equal(exceptionThrown, true);
        });
    });

    describe('Lambda functions', function () {
        var sum = function sum() {
            var result = 0;
            [5, 5, 5].forEach(function addTo(number) { result += number; }); // addTo() is a Lambda function
            return result;
        };

        it('Lambdas', function () {
            assert.equal(sum(), 15);
        });
    });

    describe('Prototypes without IIFE', function () {
        var Lightbulb = function () {
            this.isOn = false;
        },
            lightbulb = new Lightbulb();

        Lightbulb.prototype.toggle = function () {
            this.isOn = !this.isOn;
            return this.isOn;
        };

        Lightbulb.prototype.getState = function getState() {
            // Implementation...
        };

        Lightbulb.prototype.off = function off() {
            // Implementation...
        };

        Lightbulb.prototype.on = function on() {
            // Implementation...
        };

        Lightbulb.prototype.blink = function blink() {
            // Implementation...
        };

        it('Prototypes without IIFE', function () {
            assert.equal(lightbulb.toggle(), true, 'Lightbulb turns on.');
            assert.equal(lightbulb.toggle(), false, 'Lightbulb turns off.');
        });
    });

    describe('Prototypes with IIFE', function () {
        (function () {
            var isOn = false,
                toggle = function toggle() {
                    isOn = !isOn;
                    return isOn;
                },
                getState = function getState() {
                    // Implementation...
                },
                off = function off() {
                    // Implementation...
                },
                on = function on() {
                    // Implementation...
                },
                blink = function blink() {
                    // Implementation...
                },

                lightbulb = {
                    toggle: toggle,
                    getState: getState,
                    off: off,
                    on: on,
                    blink: blink
                };

            it('Prototypes with IIFE', function () {
                assert.equal(lightbulb.toggle(), true, 'Lightbulb turns on.');
                assert.equal(lightbulb.toggle(), false, 'Lightbulb turns off.');
            });
        }());
    });

    describe('Method Context', function () {
        function highPass(number, cutoff) {
            cutoff = cutoff || this.cutoff;  // When you invoke a method with dot notation, you have access to the object’s properties using this
            return (number >= cutoff);
        }

        it('Invoking a function.', function () {
            assert.equal(highPass(6, 5), true, '6 >= 5 should be true.');
        });

        var filter1 = {
            highPass: highPass,
            cutoff: 5
        };

        it('Invoking a method1.', function () {
            assert.equal(filter1.highPass(3), false, '3 >= 5 should be false.');
        });

        it('Invoking a method2.', function () {
            assert.equal(filter1.highPass(6), true, '6 >= 5 should be true.');
        });

        var filter2 = {
            // No highPass here!
            cutoff: 3
        };

        it('Invoking a method3.', function () {  // the .call() method allows you to call any method or function on any object
            assert.equal(highPass.call(filter2, 3), true, '3 >= 3 should be true.');  // The signature is: someMethod.call(context, argument1, argument2, ...);
        });  //  If you need to pass an array of arguments, use .apply() instead: someMethod.apply(context, someArray);
    });

    describe('function expression without binding', function () {
        var lightbulb = {
            toggle: function toggle() {
                this.isOn = !this.isOn;
                return this.isOn;
            },
            isOn: false
        },
            toggle = lightbulb.toggle;

        it('Invoking a function expression without binding', function () {
            lightbulb.toggle.call(null);
            assert.equal(lightbulb.isOn, false, 'We toggled the lightbulb - it should be on (true) but it was invoked out of context.');
        });
    });

    describe('function expression with binding', function () {
        var lightbulb = {
            toggle: function toggle() {
                this.isOn = !this.isOn;
                return this.isOn;
            },
            isOn: true
        },
            toggle = lightbulb.toggle.bind(lightbulb);

        it('Invoking a function expression with binding', function () {
            lightbulb.toggle.call(null);
            assert.equal(lightbulb.isOn, true, 'We toggled the lightbulb - it should be on (true).');
        });
    });

    describe('Closure: data hiding', function () {
        var o = function o() {
            var data = 1,
                get;

            get = function get() {
                return data;
            };

            return {
                get: get
            };
        };

        var obj = o();

        it('Closure: access getter', function () {
            var value = obj.get();
            assert.equal(obj.get(), 1);
        });

        var exceptionThrown = false;

        var temp = undefined;

        try {
            temp = data;
        } catch (e) {
            exceptionThrown = true;
        }

        it('Closure: access data', function () {
            assert.equal(exceptionThrown, true);
        });
    });

    describe('Dynamic Dispatch', function () {
        var methods = {
            init: function (args) {
                return 'initializing...';
            },
            hello: function (args) {
                return 'Hello, ' + args;
            },
            goodbye: function (args) {
                return 'Goodbye, cruel ' + args;
            }
        },
            greet = function greet(options) {
                var args = [].slice.call(arguments, 0),
                    initialized = false,
                    action = 'init'; // init will run by default

                if (typeof options === 'string' &&
                    typeof methods[options] === 'function') {

                    action = options;
                    args.shift();
                }

                return methods[action](args);
            };

        it('Dynamic dispatch', function () {
            assert.equal(greet(), 'initializing...', 'Dispatched to init.');
            assert.equal(greet('hello', 'world!'), 'Hello, world!', 'Dispatched to hello method.');
            assert.equal(greet('goodbye', 'world!'), 'Goodbye, cruel world!', 'Dispatched to goodbye method.');
        });
    });


    describe('Generics and Collection Polymorphism', function () {
        var toArray = function toArray(obj) {
            var arr = [],
                prop;

            for (prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    arr.push(prop);
                }
            }
            return arr;
        };

        var randomItem = function randomItem(collection) {
            var arr = ({}.toString.call(collection) !==
                '[object Array]')
                ? toArray(collection)
                : collection;
            return arr[Math.floor(arr.length * Math.random())];
        };

        it('randomItem()', function () {
            var obj = {
                a: 'a',
                b: 'b',
                c: 'c'
            },
                arr = ['a', 'b', 'c'];

            assert.equal(obj.hasOwnProperty(randomItem(obj)), true, 'randomItem works on Objects.');
            assert.equal(obj.hasOwnProperty(randomItem(arr)), true, 'randomItem works on Arrays.');
        });
    });

    describe('Functional Programming - Anonymous Sort Method', function () {
        var shows = [
            {
                artist: 'Kreap',
                city: 'Melbourne',
                ticketPrice: '40'
            },
            {
                artist: 'DJ EQ',
                city: 'Paris',
                ticketPrice: '38'
            },
            {
                artist: 'Treasure Fingers',
                city: 'London',
                ticketPrice: '60'
            }
        ],
            books = [
                {
                    title: 'How to DJ Proper',
                    price: '18'
                },
                {
                    title: 'Music Marketing for Dummies',
                    price: '26'
                },
                {
                    title: 'Turntablism for Beginners',
                    price: '15'
                }
            ];

        it('Datatype abstraction', function () {
            var sortedShows = shows.sort(function (a, b) {
                return a.ticketPrice < b.ticketPrice;
            }),
                sortedBooks = books.sort(function (a, b) {
                    return a.price < b.price;
                });
            assert.equal(sortedShows[0].ticketPrice > sortedShows[2].ticketPrice, true, 'Shows sorted correctly.');
            assert.equal(sortedBooks[0].price > sortedBooks[1].price, true, 'Books sorted correctly.');
        });
    });

    describe('Stateless Functions - First Try', function () {
        var rotate = function rotate(arr) {
            arr.push(arr.shift());
            return arr;
        }

        var original = [1, 2, 3];

        it('Rotate - Check Output', function () {
            assert.deepStrictEqual(rotate(original), [2, 3, 1], 'rotate() should rotate array elements.');
        });

        it('Rotate - Check Original', function () {
            rotate(original);
            // Fails! Original array gets mutated.
            assert.notDeepStrictEqual(original, [1, 2, 3], 'Should not mutate external data.');
        });
    });

    describe('Stateless Functions - Fixed', function () {
        var rotate = function rotate(arr) {
            var newArray = arr.slice(0);
            newArray.push(newArray.shift());
            return newArray;
        }

        var original = [1, 2, 3];

        it('Rotate - Check Output', function () {
            assert.deepStrictEqual(rotate(original), [2, 3, 1], 'rotate() should rotate array elements.');
        });

        it('Rotate - Check Original', function () {
            rotate(original);
            assert.deepStrictEqual(original, [1, 2, 3], 'Should not mutate external data.');
        });
    });

    describe('Partial Application and Currying', function () {
        var multiply = function multiply(x, y) {
            return x * y;
        },

            partial = function partial(fn) {
                // Drop the function from the arguments list and
                // fix arguments in the closure.
                var args = [].slice.call(arguments, 1);

                // Return a new function with fixed arguments.
                return function () {
                    // Combine fixed arguments with new arguments
                    // and call fn with them.
                    var combinedArgs = args.concat(
                        [].slice.call(arguments));
                    return fn.apply(this, combinedArgs);
                };
            },

            double = partial(multiply, 2);

        it('Partial application', function () {
            assert.equal(double(4), 8, 'partial() works.');
        });
    });

    describe('Partial Application and Currying using bind', function () {
        var multiply = function multiply(x, y) {
            return x * y;
        },

            boundDouble = multiply.bind(null, 2); // null context

        it('Partial application', function () {
            assert.equal(boundDouble(4), 8, 'partial() works.');
        });
    });

    describe('Callbacks', function () {
        it('Async callback event listener', function (done) {
            var callbackMade = false;

            var callback = function () {
                callbackMade = true;
                done();
            };

            setTimeout(function () {
                callback();
                assert.ok(callbackMade, "Callback should have been made now.");
            }, 20);

            assert.ok(!callbackMade, "Callback should not have been made yet.");
        });
    });

    describe('Promises', function () {
        it('Promise API', function (done) {
            var asyncComplete = false;

            var promise = new Promise(function (resolve, reject) {
                // do a thing, possibly async, then…
                setTimeout(function () {
                    asyncComplete = true;

                    if (asyncComplete) {
                        resolve("Stuff worked!");
                    } else {
                        reject(Error("It broke"));
                    }
                }, 20);
            });

            promise.then(function (result) {
                assert.ok(true);
                done();
            }, function (err) {
                assert.ok(false);
                done();
            });
        });
    });
});