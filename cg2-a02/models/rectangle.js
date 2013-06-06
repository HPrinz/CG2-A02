/*
 * Module: Rectangle
 */


/* requireJS module definition */
define(["util", "vbo"], 
       (function(Util, vbo) {
       
    "use strict";
    
    // constructor, takes WebGL context object as argument
    var Rectangle = function(gl) {
    
        // generate vertex coordinates and store in an array
        var coords = [ -0.5, 0,  0,  // coordinates of A
                        0.5, 0,  0,  // coordinates of B
                        0.5, 1.0,  0,  // coordinates of C
                       
                       -0.5, 0,  0,  // coordinates of A'
                        0.5, 1.0,  0,  // coordinates of C'
                       -0.5, 1.0,  0   // coordinates of D
                          
                     ];

        // create vertex buffer object (VBO) for the coordinates
        this.coordsBuffer = new vbo.Attribute(gl, { "numComponents": 3,
                                                    "dataType": gl.FLOAT,
                                                    "data": coords 
                                                  } );            
    };

    // draw method: activate buffers and issue WebGL draw() method
    Rectangle.prototype.draw = function(gl,program) {

        // bind the attribute buffers
        this.coordsBuffer.bind(gl, program, "vertexPosition");
        
        // connect the vertices with triangles
        gl.drawArrays(gl.TRIANGLES, 0, this.coordsBuffer.numVertices());
    };
        
    // this module only returns the constructor function    
    return Rectangle;

})); // define

    
