/*
 *
 * Module main: CG2 Aufgabe 2 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 */

/* 
 *  RequireJS alias/path configuration (http://requirejs.org/)
 */

requirejs.config({
	paths : {

		// jquery library
		"jquery" : [
		// try content delivery network location first
		'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min',
		// If the load via CDN fails, load locally
		'../lib/jquery-1.7.2.min' ],

		// gl-matrix library
		"gl-matrix" : "../lib/gl-matrix-1.3.7"

	}
});

/*
 * The function defined below is the "main" module, it will be called once all prerequisites listed in the define()
 * statement are loaded.
 * 
 */

/* requireJS module definition */
define([ "jquery", "gl-matrix", "util", "scene", "animation", "html_controller" ], (function($, glmatrix, util, Scene, Animation,
		HtmlController) {

	"use strict";

	$(document).ready((function() {

		// create WebGL context object for the named canvas object
		var gl = util.makeWebGLContext("drawing_area");

		// create scene, create animation, and draw once
		var scene = new Scene(gl);
		var animation = makeAnimation(scene);
		scene.draw();

		// create HtmlController that takes care of all interaction
		// of HTML elements with the scene and the animation
		var controller = new HtmlController(scene, animation);

	})); // $(document).ready()

	/*
	 * create an animation that rotates the scene around the Y axis over time.
	 */
	var makeAnimation = function(scene) {

		var turn = 0;
		var time = 0;

		// create animation to rotate the scene
		var animation = new Animation((function(t, deltaT) {

			// rotate by 25Â° around the X axis to get a tilted perspective
			var matrix = mat4.create(scene.cameraTransformation);

			// rotation around Y axis, depending on animation time
			var angle = t / 1000 * animation.customSpeed / 180 * Math.PI; // 10 deg/sec, in radians

			var speed = 0.1;


			
			// set the scene's transformation to what we have calculated
			scene.transformation = matrix;

			if (time < 135) {
				// make one round
				time++;
				// move everything forward
				scene.robot.rotate("raederScharniere", speed / 2);
				scene.robot.rotate("dreiecke", speed/2);
				
				
				if (turn < 7) {
					// rotate the lok
					scene.robot.rotate("lok", speed);
					turn++;
				} else if (turn < 14) {
					// rotate the hänger
					scene.robot.rotate("kupplung", speed);
					turn++;
				} else {
					// start over
					turn = 0;
				}

			} else if (time < 170) {
				// move backward smoothly
				var movespeed = -(speed * (time - 134)) / 60;
				scene.robot.rotate("raederScharniere", movespeed);
				scene.robot.rotate("dreiecke", Math.abs(movespeed) );
				time++;
			} else if (time < 200) {
				// close the hänger
				scene.robot.rotate("rampenScharnier", speed / 2);
				time++;
			} else if (time < 230) {
				// open the hänger
				scene.robot.rotate("rampenScharnier", -speed / 2);
				time++;
			} else if (time < 265) {
				// move backward smoothly
				var movebackspeed = (speed * (time - 229)) / 60;
				scene.robot.rotate("raederScharniere", movebackspeed);
				scene.robot.rotate("dreiecke", Math.abs(movebackspeed));
				time++;
			} else {
				// start over
				time = 0;
			}
			// (re-) draw the scene
			scene.draw();

		})); // end animation callback

		// set an additional attribute that can be controlled from the outside
		animation.customSpeed = 20;

		return animation;

	};

})); // define module

