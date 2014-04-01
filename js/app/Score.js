    define(function(require, exports, module) {
    "use strict";
	//Includes Famous Repositories
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');

    var Modifier = require("famous/core/Modifier");
    var Transform = require("famous/core/Transform");
    var Circle = require("famous/physics/bodies/Circle");
    var View = require("famous/core/View");

    var AppUtils = require('app/Util');

      
    /** @constructor */
    function Score(){
        View.apply(this);
        this.score      = 0;
        this.surface    = null;
        this.particle   = null;
        this.visible    = true;
    };
    Score.prototype = Object.create(View.prototype); 
    Score.prototype.constructor = Score; 


    Score.prototype.attachToPhysics = function(physicsEngine){
    	//add the point to the screen so that it will score
        
        this.surface = 
            new Surface({
                size : [100,25],
                classes : ['scorer'],
                content: '<h1>0</h1>'
            });

        //NOTE: we need two transforms here, one to translate from the particle position
        //and one to scale the score (used in pulsing it)
        this.translateModifier = new Modifier({
            transform: Transform.translate(10, 10, 10)
        }); 
        

        //create a modifier with a custom render method so we can 
        //interact with this modifier programatically. Specifically
        //we want to be able to hide this. 
        this.modifier = new Modifier({
            transform: Transform.scale(1, 1, 0)
        });

        this.modifier.render = function(){
            if(this.visible){
                return {
                    transform : this.modifier.getTransform(),
                    target : this.surface.render()
                };
            }//end if visible
        }.bind(this);


	    //Create a physical particle. This will be used when a pipe overlaps this particle, 
        //the player will have scored
        this.particle = new Circle({
                    mass: 0,
                    radius: 5,
                    position : [0, 0 , 0],
                    velocity : [0,0,0]
                });

        //Render the Famous Surface from the particle. Note we did not need to link in the surface
        //here because we have created a custom render method on this.modifier
        this._add(this.particle).add(this.translateModifier).add(this.modifier);
    };

    Score.prototype.setScore = function(score){
        this.surface.setContent("<h1>" + score + "</h1>");
        AppUtils.pulse(this.modifier);
    };

    Score.prototype.show = function(score){
        this.visible = true;
    };

    Score.prototype.hide = function(score){
        this.visible = false;
    };


	module.exports = Score;
});

