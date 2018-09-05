var assert = require('assert');

describe('Car Fluent Programming Lesson', function () {
    describe('Regular way', function () {

        var Car = {

            state: "off",

            speed: 0,

            start: function start() {
                this.state = "on";
            },
            turnOff: function turnOff() {
                this.state = "off";
                this.speed = 0;
            },

            accelerate: function accelerate() {
                if (this.state === "on") {
                    this.speed += 10;
                }
            },

            brake: function brake() {

                if (this.state === "on") {
                    this.speed -= 10;
                }
            },

            getSpeed: function getSpeed() {
                return this.speed;
            },

            getStatus: function getStatus() {
                return this.state;
            }

        }
        it('Output the regular result', function () {
            var myCar = Object.create(Car);

            assert.equal(myCar.speed, 0);
            assert.equal(myCar.state, "off");


            myCar.start();
            myCar.accelerate();

            assert.equal(myCar.speed, 10);
            assert.equal(myCar.state, "on");

            myCar.turnOff();

            assert.equal(myCar.speed, 0);
            assert.equal(myCar.state, "off");



        });
    });

    describe('Fluent Way', function () {

       var Car = {

            state: "off",

            speed: 0,

            start: function start() {
                this.state = "on";
                return this;
            },
            turnOff: function turnOff() {
                this.state = "off";
                this.speed = 0;
                return this;
            },

            accelerate: function accelerate() {
                if (this.state === "on") {
                    this.speed += 10;
                }
                return this;
            },

            brake: function brake() {

                if (this.state === "on") {
                    this.speed -= 10;
                }
                return this;
            },

            getSpeed: function getSpeed() {
                return this.speed;
            },

            getStatus: function getStatus() {
                return this.state;
            }

        }

        it('Output the fluent result', function () {

            var myCar = Object.create(Car);

            assert.equal(myCar.speed, 0);
            assert.equal(myCar.state, "off");


            myCar.start().accelerate();

            assert.equal(myCar.speed, 10);
            assert.equal(myCar.state, "on");

            myCar.brake().turnOff();

            assert.equal(myCar.speed, 0);
            assert.equal(myCar.state, "off");

        });
    });
});
