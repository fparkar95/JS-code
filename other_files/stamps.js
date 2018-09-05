var stampit = require('stampit');

//Examples of factory functions

var firstBall = {
    description: "Hard ball",
    dribble(){
        console.log(`Go dribble this ${this.description}!`);
    }
};

function FirstBallFactory(){
    return Object.create(firstBall);
}

var f_basketball = FirstBallFactory();
f_basketball.dribble();

var secondBall = {
    description: "Soft ball",
    shoot(target){
        console.log(`Go shoot this ${this.description} above the ${target}!`);
    }
};

function SecondBallFactory(){
    return Object.create(secondBall);
}

var f_tennisBall = SecondBallFactory();
f_tennisBall.shoot('net');

//We can combine these factory functions above USING STAMPS!

//dribbling some object
var Dribbles = stampit({
    methods: {
        dribble(){
            console.log(`Go dribble this ${this.description}!`);
        }
    }
});

//shooting some object
var Shootable = stampit({
    methods: {
        shoot(target){
            console.log(`Go shoot this ${this.description} above the ${target}!`);
        }
    }
});

//describing an object
var Describable = stampit({
    methods: {
       toString(){
           return this.description;
       }
    },
    //default property desc.
    props:{
        description: 'object'
    },

    //initialize the desc.
    init({description = this.description}){
        this.description = description;
    }
});

var Ball = stampit().compose(Describable, Dribbles, Shootable); //Compose together to make a stamp that can be used now like a factory

//Use Ball stamp to create a basketball object and manipulate it
var basketBall = Ball({description: 'pumped up basketball'});

basketBall.dribble();
basketBall.shoot('hoop');

//Use Ball stamp to create a tennis ball object and manipulate it
var tennisBall = Ball({description: 'soft tennis ball'});

tennisBall.dribble();
tennisBall.shoot('net');
