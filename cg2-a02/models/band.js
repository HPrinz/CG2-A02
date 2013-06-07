/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: Band
 *
 * The Band is made of two circles using the specified radius.
 * One circle is at y = height/2 and the other is at y = -height/2.
 *
 */


/* requireJS module definition */
define(["util", "vbo"], 
       (function(Util, vbo) {
       
    "use strict";
    
    /* constructor for Band objects
     * gl:  WebGL context object
     * config: configuration object with the following attributes:
     *         radius: radius of the band in X-Z plane)
     *         height: height of the band in Y
     *         segments: number of linear segments for approximating the shape
     *         asWireframe: whether to draw the band as triangles or wireframe
     *                      (not implemented yet)
     */ 
    var Band = function(gl, config) {
    
        // read the configuration parameters
        config = config || {};
        var radius       = config.radius   || 1.0;
        var height       = config.height   || 0.1;
        this.segments     = config.segments || 60;
        this.asWireframe = config.asWireframe;
        
        window.console.log("Creating a " + (this.asWireframe? "Wireframe " : "") + 
                            "Band with radius="+radius+", height="+height+", segments="+this.segments ); 
    
        // generate vertex coordinates and store in an array
        var coords = [];
        var colors = [];

        for(var i=0; i<=this.segments; i++) {
        
            // X and Z coordinates are on a circle around the origin
            var t = (i/this.segments)*Math.PI*2;
            var x = Math.sin(t) * radius;
            var z = Math.cos(t) * radius;
            // Y coordinates are simply -height/2 and +height/2 
            var y0 = height;
            var y1 = -height;
            
            // add two points for each position on the circle
            // IMPORTANT: push each float value separately!
            coords.push(x,y0,z);
            coords.push(x,y1,z);
            if(i <= this.segments/4) {
            	colors.push(0.0, 1.0, 0.0);
            	colors.push(0.0, 1.0, 0.0);
            } else if (i <= this.segments/2 && i> this.segments/4) {       	
            	colors.push(1.0, 1.0, 0.0);
            	colors.push(1.0, 1.0, 0.0);
            } else if(i <= this.segments*3/4 && i> this.segments/2) {
            	colors.push(0.0, 0.0, 1.0);
            	colors.push(0.0, 0.0, 1.0);
        	} else {
        		colors.push(0.0, 1.0, 1.0);
            	colors.push(0.0, 1.0, 1.0);
        	}           
        };      
        
        console.log("coords.length: " + coords.length);
        console.log("colors.length: " + colors.length);
        
        // create vertex buffer object (VBO) for the coordinates
        this.coordsBuffer = new vbo.Attribute(gl, { "numComponents": 3,
                                                    "dataType": gl.FLOAT,
                                                    "data": coords 
                                                  } );
        
        // generate indices coordinates and store in an array
        var bandIndices = [];
        
        // calculate x, y and z for drawing the triangles
        for(var i = 0; i< this.segments * 2; i++) {     	
        	var x;
        	var y;
        	if(i%2 == 0) {
        		x = i;
        		y = i + 1;	
           	} else {       		
        		x = i + 1;
        		y = i;
        	}
        	var z = i + 2;
        		
        	bandIndices.push(x, y, z);
        	// console.log("index: " + i + "   x: " + x + ", y: " + y + ", z: " + z);
        }
        
        var lineIndices = [];
        
        for(var i = 0; i < this.segments * 2; i++) {
        	var x = i;
        	if(i%2 == 0) {
        		var y0 = i +1;
            	lineIndices.push(x, y0);
//           	 console.log("index: " + i + "   x: " + x + ", y0: " + y0);

        	}
        	var y1 = i + 2;
        	
        	lineIndices.push(x, y1);
//        	 console.log("index: " + i + "   x: " + x + ", y1: " + y1);

        }
        // create index buffer object (VBO) for the bandIndices
        this.indexBuffer = new vbo.Indices(gl, {
        	"indices" : bandIndices
        });
        
        this.lineIndexBuffer = new vbo.Indices(gl, {
        	"indices" : lineIndices
        });
        
     // create vertex buffer object (VBO) for the colors
		this.colorBuffer = new vbo.Attribute(gl, {
			"numComponents" : 3,
			"dataType" : gl.FLOAT,
			"data" : colors
		});
    };

    // draw method: activate buffers and issue WebGL draw() method
    Band.prototype.draw = function(gl,program) {
    
        // bind the attribute buffers
        this.coordsBuffer.bind(gl, program, "vertexPosition");
        this.colorBuffer.bind(gl, program, "vertexColor");
        // draw the vertices as points
//        gl.drawArrays(gl.POINTS, 0, this.coordsBuffer.numVertices());
        
        if(this.asWireframe == true) {        	
        	this.lineIndexBuffer.bind(gl);
        	gl.drawElements(gl.LINES, this.lineIndexBuffer.numIndices(), gl.UNSIGNED_SHORT, 0);
        } else {
        	this.indexBuffer.bind(gl);
        	gl.drawElements(gl.TRIANGLES, this.indexBuffer.numIndices(), gl.UNSIGNED_SHORT, 0);
        }
    };
        
    // this module only returns the Band constructor function    
    return Band;

})); // define

    
