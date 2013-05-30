/*
 * WebGL core teaching framwork 
 * 
 * Module: Robot
 *
 * The Robot is made of 
 *
 */

/* requireJS module definition */
define(["util", "vbo", "gl-matrix", "scene_node", "models/band", "models/cube", "models/triangle"], 
       (function(util, vbo, glMatrix, sceneNode, band, cube, triangle) {
       
    "use strict";
    
    /* constructor for Robot objects
     */ 
    var Robot = function(gl) {

    };

    // draw method: activate buffers and issue WebGL draw() method
    Robot.prototype.draw = function(gl,program) {
    

    };
        
    // this module only returns the Robot constructor function    
    return Robot;

})); // define

    
