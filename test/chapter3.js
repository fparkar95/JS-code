// "use strict"

var _ = require('underscore');
var assert = require('assert');

describe('Chapter3 Functions', function () {
    describe('primitive types get the object treatment', function () {
        var domain = 'tonya@example.com'.split('@')[1];

        it('Partial application', function () {
            assert.equal(domain, 'example.com');
        });
    });


    describe('Delegate Prototypes', function () {
        if (!Object.create) {
            Object.create = function (o) {
                if (arguments.length > 1) {
                    throw new Error('Object.create implementation'
                        + ' only accepts the first parameter.');
                }
                function F() { }
                F.prototype = o;
                return new F();
            };
        }

        var switchProto = {
            isOn: function isOn() {
                return this.state;
            },

            toggle: function toggle() {
                this.state = !this.state;
                return this;
            },

            state: false
        },
            switch1 = Object.create(switchProto),
            switch2 = Object.create(switchProto);

        it('Object.create', function () {
            assert.ok(switch1.toggle().isOn(), '.toggle() works.');

            assert.ok(!switch2.isOn(), 'instance safe.');
        });
    });

    describe('Prototype inheritance is a shallow copy', function () {
        if (!Object.create) {
            Object.create = function (o) {
                if (arguments.length > 1) {
                    throw new Error('Object.create implementation'
                        + ' only accepts the first parameter.');
                }
                function F() { }
                F.prototype = o;
                return new F();
            };
        }

        var switchProto = {
            isOn: function isOn() {
                return this.state;
            },

            toggle: function toggle() {
                this.state = !this.state;
                return this;
            },

            meta: {
                name: 'Light switch'
            },

            state: false
        },
            switch1 = Object.create(switchProto),
            switch2 = Object.create(switchProto);

        it('Prototype mutations', function () {
            switch2.meta.name = 'Breaker switch';
            assert.equal(switch1.meta.name, 'Breaker switch', 'Object and array mutations are shared.');
            assert.equal(switch2.meta.name, 'Breaker switch', 'Object and array mutations are shared.');

            switch2.meta = { name: 'Power switch' };
            assert.equal(switch1.meta.name, 'Breaker switch', 'Property replacement is instance-specific.');
            assert.equal(switch2.meta.name, 'Power switch', 'Property replacement is instance-specific.');
        });
    });

    describe('Prototype Cloning is also a shallow copy', function () {
        _.extend = function (obj) {
            _.each(Array.prototype.slice.call(arguments, 1), function (source) {
                for (var prop in source) {
                    obj[prop] = source[prop];
                }
            });
            return obj;
        };

        var switchProto = {
            isOn: function isOn() {
                return this.state;
            },

            toggle: function toggle() {
                this.state = !this.state;
                return this;
            },

            meta: {
                name: 'Light switch'
            },

            state: false
        },

            switch1 = _.extend({}, switchProto),
            switch2 = _.extend({}, switchProto);

        it('Prototype clones.', function () {
            switch1.isOn.isShared = true;
            assert.ok(!switch2.isShared, 'Methods are copied for each instance, not shared.');

            assert.ok(switch1.toggle().isOn(), '.toggle() works.');
            assert.ok(!switch2.isOn(), 'instance safe.');

            switch2.meta.name = 'Breaker switch';
            assert.equal(switch1.meta.name, 'Breaker switch', 'Object and array mutations are shared.');

            switch2.meta = { name: 'Power switch' };
            assert.equal(switch1.meta.name, 'Breaker switch', 'Property replacement is instance-specific.');
        });
    });

    describe('Flyweight Pattern', function () {
        var enemyPrototype = {
            name: 'Wolf',
            position: { // Override this with setPosition
                x: 0,
                y: 0
            },
            setPosition: function setPosition(x, y) {
                this.position = {
                    x: x,
                    y: y
                };
                return this;
            },
            health: 20, // Overrides automatically on change
            bite: function bite() {
            },
            evade: function evade() {
            }
        },

            spawnEnemy = function () {
                return Object.create(enemyPrototype);
            };

        it('Flyweight pattern.', function () {
            var wolf1 = spawnEnemy(),
                wolf2 = spawnEnemy();

            wolf1.health = 5;
            assert.ok(wolf2.health = 20, 'Primitives override automatically.');

            assert.ok(wolf1.setPosition(10, 10).position.x === 10, 'Object override works.');
            assert.equal(wolf2.position.x, 0, 'The prototype should remain unchanged.');
        });
    });

    describe('Constructors', function () {
        function Car(color, direction, mph) {
            this.color = color || 'pink';
            this.direction = direction || 0; // 0 = Straight ahead
            this.mph = mph || 0;

            this.gas = function gas(amount) {
                amount = amount || 10;
                this.mph += amount;
                return this;
            };

            this.brake = function brake(amount) {
                amount = amount || 10;
                this.mph = ((this.mph - amount) < 0) ? 0
                    : this.mph - amount;
                return this;
            };
        }

        var myCar = new Car();

        it('Constructor', function () {
            assert.ok(myCar.color, 'Has a color');
            assert.equal(myCar.gas().mph, 10, '.accelerate() should add 10mph.');
            assert.equal(myCar.brake(5).mph, 5, '.brake(5) should subtract 5mph.');
        });
    });

    describe('Private Variables', function () {
        function Car(color, direction, mph) {
            var isParkingBrakeOn = false;
            this.color = color || 'pink';
            this.direction = direction || 0; // 0 = Straight ahead
            this.mph = mph || 0;

            this.gas = function gas(amount) {
                amount = amount || 10;
                this.mph += amount;
                return this;
            };
            this.brake = function brake(amount) {
                amount = amount || 10;
                this.mph = ((this.mph - amount) < 0) ? 0
                    : this.mph - amount;
                return this;
            };
            this.toggleParkingBrake = function toggleParkingBrake() {
                isParkingBrakeOn = !isParkingBrakeOn;
                return this;
            };
            this.isParked = function isParked() {
                return isParkingBrakeOn;
            };
        }

        var myCar = new Car();

        it('Constructor with private property.', function () {
            assert.ok(myCar.color, 'Has a color');
            assert.equal(myCar.gas().mph, 10, '.accelerate() should add 10mph.');
            assert.equal(myCar.brake(5).mph, 5, '.brake(5) should subtract 5mph.');
            assert.ok(myCar.toggleParkingBrake().isParked(), '.toggleParkingBrake works.');
        });
    });

    describe('Object literal notation', function () {
        var myCar = {
            color: 'pink',
            direction: 0,
            mph: 0,

            gas: function gas(amount) {
                amount = amount || 10;
                this.mph += amount;
                return this;
            },

            brake: function brake(amount) {
                amount = amount || 10;
                this.mph = ((this.mph - amount) < 0) ? 0
                    : this.mph - amount;
                return this;
            }
        };

        it('Object literal notation.', function () {
            assert.ok(myCar.color, 'Has a color');
            assert.equal(myCar.gas().mph, 10, '.accelerate() should add 10mph.');
            assert.equal(myCar.brake(5).mph, 5, '.brake(5) should subtract 5mph.');
        });
    });
});