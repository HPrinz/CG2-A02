/*
 * WebGL core teaching framwork 
 * 
 * Module: Robot
 *
 * The Robot is made of 
 *
 */

/* requireJS module definition */
define(["util", "vbo", "gl-matrix", "scene_node", "models/band", "models/cube", "models/triangle", "models/pyramid" , "models/rectangle" ], 
       (function(util, vbo, glMatrix, SceneNode, Band, Cube, Triangle, Pyramid, Rectangle) {
       
    "use strict";
    
    /* constructor for Robot objects
     */ 
    var Robot = function(gl, programs, config) {
    	
    	// ### Components we need ###
    	var cube = new Cube(gl);
    	var band = new Band(gl,{radius: 0.5, height: 0.2, segments: 40, asWireframe: false});
        var triangle = new Triangle(gl);
        var pyramid = new Pyramid(gl);
        var rectangle = new Rectangle(gl);
        
        // #### Sizes ###
        // breite, hoehe, tiefe
        var lokSize = [0.8, 0.3, 0.3];
        
        /*--*/var fahrerHausSize = [0.3, 0.2, 0.3];
                
        // Groesse aller 6 Raeder
        /*-----*/var raederSize = [0.15, 0.15, 0.15];
        
        // Groesse der Radscharniere
        /*--+*/var raederScharnierSize = [1.0, 0.02, 0.02];
        
        /*---+*/var schornsteinSize = [0.1, 0.8, 0.1];
        /*-----*/var dreieckeSize = [];
        
        /*---*/var zugspitzeSize = [0.1, 0.1, 0.3];
        
        // Groesse der Kupplungsverbindungen 
        /*--+*/var kupplungVerbindungSize = [0.05, 0.05, 0.05];
        
        /*---+*/var kupplungSize = [0.1, 0.05, 0.1];
        /*-------+*/var anhaengerSize = [0.6, 0.3, 0.3];
        /*----------*/var rampenScharnierSize = [0.5, 0.03, 0.03];
        var rampeSize = [0.3, 0.4, 0.3]; 
        
        // #### Translations ###
        // Kids first
        this.rampe = new SceneNode("rampe");
        mat4.translate(this.rampe.transformation, [rampeSize[0]/2 , 0, -anhaengerSize[2]/2]);
        
        /*----------*/this.rampenScharnier = new SceneNode("rampenScharnier", [this.rampe]);
        mat4.translate(this.rampenScharnier.transformation, [anhaengerSize[0]/2, -anhaengerSize[1]/2, 0]);

        /*------------*/ this.anhaengerRadL = new SceneNode("anhaengerRadL");
        mat4.translate(this.anhaengerRadL.transformation, [0, 0, raederScharnierSize[2] * 9]);
        
        /*------------*/this.anhaengerRadR = new SceneNode("anhaengerRadR");
        mat4.translate(this.anhaengerRadR.transformation, [0, 0, -raederScharnierSize[2] * 9]);

        /*----------*/this.anhaengerScharnier = new SceneNode("anhaengerScharnier", [this.anhaengerRadL, this.anhaengerRadR]);
        mat4.translate(this.anhaengerScharnier.transformation, [anhaengerSize[0]/16, -anhaengerSize[1]/2, 0]);

        /*--------*/this.anhaenger = new SceneNode("anhaenger", [this.anhaengerScharnier, this.rampenScharnier]);
        mat4.translate(this.anhaenger.transformation, [anhaengerSize[0]/2 + kupplungVerbindungSize[0]/2, anhaengerSize[1]/4, 0]);

        /*------*/this.anhaengerKupplung = new SceneNode("anhaengerKupplung", [this.anhaenger]);
        mat4.translate(this.anhaengerKupplung.transformation, [kupplungSize[0]/2 + kupplungVerbindungSize[0]/2, 0, 0]);
        
        /*----*/this.kupplung = new SceneNode("kupplung", [this.anhaengerKupplung]);
        mat4.translate(this.kupplung.transformation, [kupplungSize[0]/2 + kupplungVerbindungSize[0]/2, 0, 0]);
        
        /*--*/this.lokKupplung = new SceneNode("lokKupplung", [this.kupplung]);
        mat4.translate(this.lokKupplung.transformation, [lokSize[0]/2 + kupplungVerbindungSize[0]/2, -lokSize[1]/4, 0]);
        
        /*--*/this.zugspitze = new SceneNode("zugspitze");
        mat4.translate(this.zugspitze.transformation, [-lokSize[0]/2, -lokSize[1] + zugspitzeSize[1] * 2, 0]);

        /*----*/this.dreiecke = new SceneNode("dreiecke");
        
        /*--*/this.schornstein = new SceneNode("schornstein", [this.dreiecke]);
        mat4.translate(this.schornstein.transformation, [-lokSize[0]/3, lokSize[1], 0]);
        
        /*----*/this.radHL = new SceneNode("radHL");
        mat4.translate(this.radHL.transformation, [0, 0, raederScharnierSize[2] * 9]);

        /*----*/this.radHR = new SceneNode("radHR");
        mat4.translate(this.radHR.transformation, [0, 0, -raederScharnierSize[2] * 9]);
        
        /*--*/this.scharnierLokHinten = new SceneNode("scharnierLokHinten", [this.radHL, this.radHR]);
        mat4.translate(this.scharnierLokHinten.transformation, [lokSize[0]/4, -lokSize[1]/2, 0]);
        
        /*----*/this.radVL = new SceneNode("radVL");
        mat4.translate(this.radVL.transformation, [0, 0, raederScharnierSize[2] * 9]);
        
        /*----*/this.radVR = new SceneNode("radVR");
        mat4.translate(this.radVR.transformation, [0, 0, -raederScharnierSize[2] *9]);
        
        /*--*/this.scharnierLokVorne = new SceneNode("scharnierLokVorne", [this.radVL, this.radVR]);
        mat4.translate(this.scharnierLokVorne.transformation, [-lokSize[0]/4, -lokSize[1]/2, 0]);

        /*--*/this.fahrerHaus = new SceneNode("fahrerHaus");
        mat4.translate(this.fahrerHaus.transformation, [lokSize[0]/2 - fahrerHausSize[0]/2 , lokSize[1]/2 + fahrerHausSize[1]/2, 0]);

        this.lok = new SceneNode("lok", [this.fahrerHaus, this.scharnierLokVorne, this.scharnierLokHinten, this.schornstein, this.zugspitze, this.lokKupplung]);
        mat4.translate(this.lok.transformation, [-lokSize[0]/2, -lokSize[1]/2, 0]);
        
        // ### Skins ###
        //TODO
        var lokSkin = new SceneNode("lok skin", [cube], programs.red);
        mat4.scale(lokSkin.transformation, lokSize);
        
        var fahrerHausSkin = new SceneNode("fahrerHaus skin", [cube] , programs.blue);
        mat4.scale(fahrerHausSkin.transformation, fahrerHausSize);
        
        // Skin für alle Räder 
        var raederSkin = new SceneNode("raeder skin", [band], programs.black);
        mat4.scale(raederSkin.transformation, raederSize);
        mat4.rotate(raederSkin.transformation, Math.PI/2, [0,1,0]);
        mat4.rotate(raederSkin.transformation, Math.PI/2, [0,0,1]);
        
        var rampenScharnierSkin = new SceneNode("rampenScharnier skin",[band], programs.yellow);
        mat4.rotate(rampenScharnierSkin.transformation, Math.PI/2, [0,1,0]);
        mat4.scale(rampenScharnierSkin.transformation, rampenScharnierSize);
        mat4.rotate(rampenScharnierSkin.transformation, Math.PI/2, [0,0,1]);
        
        var raederScharnierSkin = new SceneNode("raederScharnier skin", [band], programs.black);
        mat4.rotate(raederScharnierSkin.transformation, Math.PI/2, [0,1,0]);
        mat4.scale(raederScharnierSkin.transformation, raederScharnierSize);
        mat4.rotate(raederScharnierSkin.transformation, Math.PI/2, [0,0,1]);
        
        var schornsteinSkin = new SceneNode("schornstein skin", [band], programs.green);
        mat4.scale(schornsteinSkin.transformation, schornsteinSize);

        var zugspitzeSkin =  new SceneNode("zugspitze skin", [pyramid], programs.yellow);
        mat4.rotate(zugspitzeSkin.transformation, Math.PI/2, [0,0,1]);
        mat4.scale(zugspitzeSkin.transformation, zugspitzeSize);
        
        var kupplungVerbindungSkin = new SceneNode("kupplungVerbindung skin", [cube] , programs.yellow);
        mat4.scale(kupplungVerbindungSkin.transformation, kupplungVerbindungSize);

        var kupplungSkin =  new SceneNode("kupplung skin", [band] , programs.green);
        mat4.scale(kupplungSkin.transformation, kupplungSize);

        var anhaengerSkin = new SceneNode("anhaenger skin", [cube] , programs.red);
        mat4.scale(anhaengerSkin.transformation, anhaengerSize);
        
        var rampeSkin = new SceneNode("rampe skin", [rectangle] , programs.black);
        mat4.scale(rampeSkin.transformation, rampeSize);
        mat4.rotate(rampeSkin.transformation, Math.PI/2, [1,0,0]);

        // ### Add Skeleton to Skin ###
       
        this.lok.addObjects([lokSkin]);
        this.fahrerHaus.addObjects([fahrerHausSkin]);
        
        this.radVR.addObjects([raederSkin]);
        this.radVL.addObjects([raederSkin]);
        this.radHR.addObjects([raederSkin]);
        this.radHL.addObjects([raederSkin]);
        this.anhaengerRadR.addObjects([raederSkin]);
        this.anhaengerRadL.addObjects([raederSkin]);
        
        this.rampenScharnier.addObjects([rampenScharnierSkin]);
        
        this.scharnierLokVorne.addObjects([raederScharnierSkin]);
        this.scharnierLokHinten.addObjects([raederScharnierSkin]);
        this.anhaengerScharnier.addObjects([raederScharnierSkin]);
        
        this.schornstein.addObjects([schornsteinSkin]);
        this.zugspitze.addObjects([zugspitzeSkin]);
        
        this.anhaengerKupplung.addObjects([kupplungVerbindungSkin]);        
        this.lokKupplung.addObjects([kupplungVerbindungSkin]);
        this.kupplung.addObjects([kupplungSkin]);
        
        this.anhaenger.addObjects([anhaengerSkin]);
        
        this.rampe.addObjects([rampeSkin]);
    };

    // draw method: activate buffers and issue WebGL draw() method
    Robot.prototype.draw = function(gl,program, transformation) {
    	this.lok.draw(gl, program, transformation);
    };
        
    Robot.prototype.rotate = function(angle) {
    	// TODO
    	mat4.rotate(this.rampenScharnier.transformation, angle, [0,0,1]);
    	mat4.rotate(this.kupplung.transformation, angle, [0,1,0]);
    	
    	mat4.rotate(this.scharnierLokVorne.transformation, angle, [0,0,1]);
    	mat4.rotate(this.scharnierLokHinten.transformation, angle, [0,0,1]);
    	mat4.rotate(this.anhaengerScharnier.transformation, angle, [0,0,1]);
    	mat4.translate(this.lok.transformation, [-angle,0,0]);
    };
        
    // this module only returns the Robot constructor function    
    return Robot;

})); // define

    
