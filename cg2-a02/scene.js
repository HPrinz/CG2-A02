/*
  *
 * Module scene: Computergrafik 2, Aufgabe 2
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 */


/* requireJS module definition */
define(["jquery", "gl-matrix", "util", "program", "shaders", 
        "models/triangle",  "models/cube" , "models/band", "models/robot" , "models/pyramid" ,"models/rectangle" ], 
       (function($, glmatrix, util, Program, shaders,
                 Triangle, Cube, Band, Robot, Pyramid, Rectangle) {

    "use strict";
    
    // simple scene: create some scene objects in the constructor, and
    // draw them in the draw() method
    var Scene = function(gl) {

        // store the WebGL rendering context 
        this.gl = gl;  
            
        // create all required GPU programs from vertex and fragment shaders
        this.programs = {};
        this.programs.vertexColor = new Program(gl, 
                                                shaders.vs_PerVertexColor(), 
                                                shaders.fs_PerVertexColor() );   
        this.programs.red = new Program(gl, 
                shaders.vs_NoColor(), 
                shaders.fs_ConstantColor([1.0,0.0,0.0,1.0]) );
        
        this.programs.blue = new Program(gl, 
                shaders.vs_NoColor(), 
                shaders.fs_ConstantColor([0.0,0.0,1.0,1.0]) );
        
        this.programs.green = new Program(gl, 
                shaders.vs_NoColor(), 
                shaders.fs_ConstantColor([0.0,1.0,0.0,1.0]) );

        this.programs.black = new Program(gl, 
                shaders.vs_NoColor(), 
                shaders.fs_ConstantColor([0.0,0.0,0.0,1.0]) );
        
        this.programs.yellow = new Program(gl, 
                shaders.vs_NoColor(), 
                shaders.fs_ConstantColor([1.0,1.0,0.0,1.0]) );
        
        // create some objects to be used for drawing
        this.triangle = new Triangle(gl, true);
        this.cube = new Cube(gl);
        this.band = new Band(gl,{radius: 0.5, height: 0.2, segments: 40, asWireframe: false});
        this.bandWireframes = new Band(gl, {radius: 0.5, height: 0.2, segments: 40, asWireframe: true});
        this.pyramid = new Pyramid(gl);
        this.rectangle = new Rectangle(gl);
        
        this.robot = new Robot(gl, this.programs);

        // initial position of the camera
        this.cameraTransformation = mat4.lookAt([0,0.5,3], [0,-0.5,0], [0,1,0]);

        // transformation of the scene, to be changed by animation
        this.transformation = mat4.create(this.cameraTransformation);

        // the scene has an attribute "drawOptions" that is used by 
        // the HtmlController. Each attribute in this.drawOptions 
        // automatically generates a corresponding checkbox in the UI.
        this.drawOptions = { "Perspective Projection": false, 
                             "Show Triangle": false,
                             "Show Cube": false,
                             "Show Band as Wireframe": false,
                             "Show Band": false,
                             "Depth Test": false,
                             "Show Front Face": false,
        					 "Show Back Face": false,
        					 "Show Pyramid": false,
        					 "Show Rectangle": false,
        					 "Show Robot": true
        				 	};                       
    };

    // the scene's draw method draws whatever the scene wants to draw
    Scene.prototype.draw = function() {
        
        // just a shortcut
        var gl = this.gl;

        // set up the projection matrix, depending on the canvas size
        var aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
        var projection = this.drawOptions["Perspective Projection"] ?
                             mat4.perspective(45, aspectRatio, 0.01, 100) : 
                             mat4.ortho(-aspectRatio, aspectRatio, -1,1, 0.01, 100);


        // set the uniform variables for all used programs
        for(var p in this.programs) {
            this.programs[p].use();
            this.programs[p].setUniform("projectionMatrix", "mat4", projection);
            this.programs[p].setUniform("modelViewMatrix", "mat4", this.transformation);
        }
        
        // clear color and depth buffers
        gl.clearColor(0.8, 0.7, 0.5, 1.0); 
        gl.clear(gl.COLOR_BUFFER_BIT |gl.DEPTH_BUFFER_BIT); 
            
     // set up depth test to discard occluded fragments
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LESS);  
                
        // draw the scene objects
        if(this.drawOptions["Show Triangle"]) {    
           this.triangle.draw(gl, this.programs.vertexColor);
        }
        if(this.drawOptions["Show Cube"]) {    
            this.cube.draw(gl, this.programs.vertexColor);
        }
        if(this.drawOptions["Show Band as Wireframe"]) {    
        	this.bandWireframes.draw(gl, this.programs.black);
        }
        if(this.drawOptions["Show Band"]) {    
            this.band.draw(gl, this.programs.vertexColor);
        }
        if(this.drawOptions["Depth Test"]) {
        	// set up depth test to discard occluded fragments
        	gl.enable(gl.DEPTH_TEST);
        	gl.depthFunc(gl.LESS);  
        }
        if(this.drawOptions["Show Front Face"]) {
        	gl.cullFace(gl.FRONT);
        	gl.enable(gl.CULL_FACE);
        }
        if(this.drawOptions["Show Back Face"]) {
        	gl.cullFace(gl.BACK);
        	gl.enable(gl.CULL_FACE);
        }
        if(this.drawOptions["Show Robot"]) {
        	this.robot.draw(gl, this.programs.red, this.transformation);
        }
        if(this.drawOptions["Show Pyramid"]) {    
            this.pyramid.draw(gl, this.programs.red);
        }
        if(this.drawOptions["Show Rectangle"]) {    
            this.rectangle.draw(gl, this.programs.red);
        }
    };

    // the scene's rotate method is called from HtmlController, when certain
    // keyboard keys are pressed. Try Y and Shift-Y, for example.
    Scene.prototype.rotate = function(rotationAxis, angle) {

        window.console.log("rotating around " + rotationAxis + " by " + angle + " degrees." );

        // degrees to radians
        angle = angle*Math.PI/180;
        
        // manipulate the corresponding matrix, depending on the name of the joint
        switch(rotationAxis) {
            case "worldY": 
                mat4.rotate(this.transformation, angle, [0,1,0]);
                break;
            case "worldX": 
                mat4.rotate(this.transformation, angle, [1,0,0]);
                break;
            case "rampenScharnier":
            	this.robot.rotate("rampenScharnier", angle);
            	break;
            case "kupplung":
            	this.robot.rotate("kupplung", angle);
            	break;
            case "raederScharniere":
            	this.robot.rotate("raederScharniere", angle);
            	break;
            case "lok":
            	this.robot.rotate("lok", angle);
            	break;
            default:
                window.console.log("axis " + rotationAxis + " not implemented.");
            	break;
        };

        // redraw the scene
        this.draw();
    };

    return Scene;            
    
})); // define module
        

