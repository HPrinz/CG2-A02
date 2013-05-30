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
       (function(util, vbo, glMatrix, SceneNode, Band, Cube, Triangle) {
       
    "use strict";
    
    /* constructor for Robot objects
     */ 
    var Robot = function(gl, programs, config) {
    	
    	// ### Components we need ###
    	var cube = new Cube(gl);
    	var band = new Band(gl,{radius: 0.5, height: 0.2, segments: 40, asWireframe: false});
        var triangle = new Triangle(gl);
        // TODO Pyramide modellieren
//        var pyramide = new Pyramide();
        
        // #### Sizes ###
        // breite, hoehe, tiefe
        var lokSize = [0.8, 0.3, 0.3];
        
        /*--*/var fahrerHausSize = [0.4, 0.3, 0.3];
        
        /*--+*/var scharnierLokVorneSize = [];
        /*-----*/var radVRSize = [];
        /*-----*/var radVLSize = [];
        
        /*--+*/var scharnierLokHintenSize = [];
        /*-----*/var radHRSize = [];
        /*-----*/var radHLSize = [];
        
        /*---+*/var schornsteinSize = [];
        /*-----*/var dreieckeSize = [];
        
        /*---*/var zugspitzeSize = [];
        
        /*--+*/var lokKupplungSize = [];
        /*---+*/var kupplungSize = [];
        /*-----+*/var anhaengerKupplungSize = [];
        /*-------+*/var anhaengerSize = [0.4, 0.35, 0.3];
        /*---------+*/var anhaengerScharnierSize = [];
        /*------------*/var anhaengerRadRSize = [];
        /*------------*/var anhaengerRadLSize = [];
        /*----------*/var rampenScharnierSize = [];
        
        // #### Translations ###
        // Kids first
        /*----------*/this.rampenScharnier = new SceneNode("rampenScharnier");
        /*------------*/this.anhaengerRadR = new SceneNode("anhaengerRadR");
        /*------------*/ this.anhaengerRadL = new SceneNode("anhaengerRadL");
        /*----------*/this.anhaengerScharnier = new SceneNode("anhaengerScharnier", [this.anhaengerRadL, this.anhaengerRadR]);
        
        /*--------*/this.anhaenger = new SceneNode("anhaenger", [this.anhaengerScharnier, this.rampenScharnier]);
        /*------*/this.anhaengerKupplung = new SceneNode("anhaengerKupplung", [this.anheanger]);
        /*----*/this.kupplung = new SceneNode("kupplung", [this.anhaengerKupplung]);
        /*--*/this.lokKupplung = new SceneNode("lokKupplung", [this.kupplung]);
        
        /*--*/this.zugspitze = new SceneNode("zugspitze");
        
        /*----*/this.dreiecke = new SceneNode("dreiecke");
        /*--*/this.schornstein = new SceneNode("schornstein", [this.dreiecke]);
        
        /*----*/this.radHL = new SceneNode("radHL");
        /*----*/this.radHR = new SceneNode("radHR");
        /*--*/this.scharnierLokHinten = new SceneNode("scharnierLokHinten", [this.radHL, this.radHR]);
        
        /*----*/this.radVL = new SceneNode("radVL");
        /*----*/this.radVR = new SceneNode("radVR");
        /*--*/this.scharnierLokVorne = new SceneNode("scharnierLokVorne", [this.radVL, this.radVR]);
        
        /*--*/this.fahrerHaus = new SceneNode("fahrerHaus");

        //this.fahrerHaus, this.scharnierLokVorne, this.scharnierLokHinten, this.schornstein, this.zugspitze, this.lokKupplung
        this.lok = new SceneNode("lok", [this.fahrerHaus]);
        // TODO 
        mat4.translate(this.lok.transformation, [0,lokSize[1]/2 + fahrerHausSize[1]/2, 0]);
        
        // ### Skins ###
        //TODO
        var lokSkin = new SceneNode("lok skin", [cube], programs.red);
        mat4.scale(lokSkin.transformation, lokSize);
        
        var fahrerHausSkin = new SceneNode("lok skin", [cube] , programs.red);
        mat4.scale(fahrerHausSkin.transformation, fahrerHausSize);
        
        // ### Add Skeleton to Skin ###
        //TODO
        this.lok.addObjects(lokSkin);
        this.fahrerHaus.addObjects(fahrerHausSkin);
        
    };

    // draw method: activate buffers and issue WebGL draw() method
    Robot.prototype.draw = function(gl,program, transformation) {
    	this.lok.draw(gl, program, transformation);

    };
        
    // this module only returns the Robot constructor function    
    return Robot;

})); // define

    
