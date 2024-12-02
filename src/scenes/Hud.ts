import { GameData } from "../GameData";
import { FaceLandmarker, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision";
import {webcamRunning, blendShapesValues, faceLandmarksValues, enableCam } from "../index";
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import { modalClose } from "../index";

export default class Hud extends Phaser.Scene {

  private _game: Phaser.Scene;
  private rexUI: UIPlugin;
  private _music: Phaser.Sound.BaseSound;
  private _audio: Phaser.GameObjects.Image; 
  private _faces: Phaser.GameObjects.Image; 
  private _close: Phaser.GameObjects.Image;
  private _faceActive: boolean = false;
  private _audioMuted: boolean = false;
  private _rendering: boolean = true;
     // Mouse move controller variable
     private _startPoint: {x: number, y: number} = null;
     private _prevPoint: {x: number, y: number} = null;
     private  _drawingUtils:any;
     private _canvas:any;
    
  private _shapeValues:Phaser.GameObjects.Text;
  private _webcamBtn: Phaser.GameObjects.Image;
  private _aim: Phaser.GameObjects.Image;

  private _faceObject:{mouthLeft:boolean,mouthRight:boolean,eyeBlinkLeft:boolean,eyeBlinkRight:boolean,smile:boolean};

  private _exitContainer: Phaser.GameObjects.Container;
  private _yesButton: Phaser.GameObjects.Image;
  private _noButton: Phaser.GameObjects.Image;
  private _exitText: Phaser.GameObjects.Text;

   constructor() {
    super({
      key: "Hud",
    });
  }

  preload() {
   // var url;

   // url = '/assets/js/rexcanvas.js';
   // this.load.plugin('rexcanvasplugin', url, true);
  }

  setGame(game:Phaser.Scene){
    this._game=game;
    this.showClose();
    this.showAudio();
    this.startAudio();
    this.hideFace();
    this.hideCamera();
  }

  create(): void {
    
    this._rendering=true;
    this._faceObject={mouthLeft:false,mouthRight:false,eyeBlinkLeft:false,eyeBlinkRight:false,smile:false};
    this._audioMuted = false;
    this._faceActive = false;

    this._exitContainer = this.add.container(0, 0);
    this._yesButton = this.add.image(150, 400, "yes").setInteractive().setTintFill(0xe3f4fa).setOrigin(0.5).setScale(1).on("pointerdown", () => {
     
      modalClose(1);
    });
    this._noButton = this.add.image(450,400, "no").setInteractive().setTintFill(0xe3f4fa).setOrigin(0.5).setScale(1).on("pointerdown", () => {
      this.hideExitGame();
    });
    this._exitText = this.add.text(300, 300, "Vuoi uscire dal gioco?", { fontSize: "24px", color: "#ffffff" }).setOrigin(0.5).setFontFamily(GameData.preloader.loadingTextFont);
   
    let _layer=this.add.image(300,512,"overlay").setOrigin(0.5).setInteractive();


    let _siText=  this.add.text(150, 400, "SI", { fontSize: "24px", color: "#002F6C" }).setOrigin(0.5).setFontFamily(GameData.preloader.loadingTextFont);

    let _noText=  this.add.text(450, 400, "NO", { fontSize: "24px", color: "#002F6C" }).setOrigin(0.5).setFontFamily(GameData.preloader.loadingTextFont);
    this._exitContainer.add([_layer,this._yesButton, this._noButton, this._exitText,_siText,_noText]).setDepth(1000).setVisible(false);
   
  
  }

  showExitGame() {
    this._exitContainer.setVisible(true);
    this._game.scene.pause();


  }

  hideExitGame() {
    this._exitContainer.setVisible(false);
    this._game.scene.resume();
  }


  showCamera(){
    this._faces.setVisible(true); 
      }
    
      hideCamera(){
    this._faces.setVisible(false);
   
      }


  showAudio(){
this._audio.setVisible(true); 
  }

  hideAudio(){
this._audio.setVisible(false);
  }

  startAudio() {
    this._music.play();
  }
  stopAudio() {
    this._music.stop();
  }

  showClose(){
    this._close.setVisible(true);
  }
  hideClose(){  
    this._close.setVisible(false);
  }


  setUp() {

   
    this._close = this.add.image(20, 20, "close").setInteractive().setTintFill(0x97cada).setScale(.5).setVisible(false).on("pointerdown", () => {
this.showExitGame();
    }).on("pointerover", () => {
      this._close.setTintFill(0xf00365a);
      this.sound.playAudioSprite("sfx", "click4");
    }).on("pointerout", () => {
      this._close.setTintFill(0x97cada);  
    });

   this._music = this.sound.add("intro", { loop: true, volume: 0.1 });


   this._audio= this.add.image(580,20,"audio").setInteractive().setTintFill(0x97cada).setScale(.5).on("pointerdown", () => {

    if(!this._audioMuted){
      this._audioMuted=true;
      this._audio.setFrame(1);
      
     
    }else{
      this._audioMuted=false;
      this._audio.setFrame(0);
     }

      this.sound.mute=this._audioMuted;

   
    }).on("pointerover", () => {
      this._audio.setTintFill(0xf00365a);
      this.sound.playAudioSprite("sfx", "click4");
    }).on("pointerout", () => {
      this._audio.setTintFill(0x97cada);  
    });

    this.hideAudio();



      
    this._shapeValues = this.add.text(10, 10, "", { fontFamily: "Arial", fontSize: "20px", color: "#00b000" }).setOrigin(0, 0).setDepth(1000).setAlpha(1);


    if(this.hasGetUserMedia())
   { 
    
    
    this._faces= this.add.image(300,740,"faces").setInteractive().setTintFill(0x97cada).setScale(1).on("pointerdown", () => {

      if(!this._faceActive){
        this._faceActive=true;
        this._faces.setFrame(1);
        this._canvas.setVisible(true);
       // this._aim.setVisible(true).setAlpha(.75);
        enableCam();
        
       
      }else{
        this._faceActive=false;
        this._faces.setFrame(0);
        this._canvas.setVisible(false);
        this._aim.setVisible(false);
        enableCam();
       }
  
  
     
      }).on("pointerover", () => {
        this._faces.setTintFill(0xf00365a);
        this.sound.playAudioSprite("sfx", "click4");
      }).on("pointerout", () => {
        this._faces.setTintFill(0x97cada);  
      });

 

    this._aim = this.add.image(371, 63, "aim").setAlpha(0).setOrigin(.5).setScale(1.5).setDepth(10);

    this._canvas = this.rexUI.add.canvas(300, -100, 600, 600).setOrigin(.5,0).generateTexture('canvas');
    this._drawingUtils= new DrawingUtils(this._canvas.getContext("2d"));
    

  }
  
  
  }





  hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  hideFace(){

    this._rendering=false;
    this._canvas.setVisible(false);
  }

  showFace(){

    this._rendering=true;
    this._canvas.setVisible(true);
  }

  checkBlendShapeValues() {

    if(blendShapesValues== null || blendShapesValues.length==0) return;
  
    this._faceObject.mouthLeft=false;
    this._faceObject.mouthRight=false;
    this._faceObject.eyeBlinkLeft=false;
    this._faceObject.eyeBlinkRight=false;
    this._faceObject.smile=false;


    if(blendShapesValues[9].score.toFixed(4)>0.4) {
      this._faceObject.eyeBlinkLeft=true;
    
    }

    if(blendShapesValues[10].score.toFixed(4)>0.4 ) {
      this._faceObject.eyeBlinkRight=true;
    
    }
  
    if(blendShapesValues[33].score.toFixed(4)>0 && blendShapesValues[39].score.toFixed(4)==0) {
      this._faceObject.mouthLeft=true;
      this._faceObject.mouthRight=false;
    }
  
    if(blendShapesValues[39].score.toFixed(4)>0 && blendShapesValues[33].score.toFixed(4)==0) {
      this._faceObject.mouthRight=true;
      this._faceObject.mouthLeft=false;
    } 

    if(blendShapesValues[44].score.toFixed(4)>=.9 && blendShapesValues[45].score.toFixed(4)>=0.9) {
      this._faceObject.smile=true;
      
    } 
  
   }


   isCameraActive():boolean{
    return webcamRunning;
   }

   isDataFlowing():boolean{

    if (blendShapesValues.length>0) return true;
    return false;
   }

   getFaceObject():{mouthLeft:boolean,mouthRight:boolean,eyeBlinkLeft:boolean,eyeBlinkRight:boolean,smile:boolean}{ 
    return this._faceObject;
  }




   getMovementScale = (point1:any, point2:any) => {
    const scaleRatioX = 10; 
    const scaleRatioY = 10;
    return {
      newX: (point2.x - point1.x) * scaleRatioX,
      newY: (point2.y - point1.y) * scaleRatioY
    };
  }
  
  detectMovement = (newPoint:any) => {
    if (!this._startPoint || !this._startPoint['x'] || !this._startPoint['y']) {
      this._startPoint = {x: newPoint.x, y: newPoint.y};
      this._prevPoint = {x: newPoint.x, y: newPoint.y};
      return this._prevPoint;
    }
     // const movement = moveDistance(prevPoint, newPoint);
     const movement =  this.getMovementScale(this._startPoint, newPoint);
     this._prevPoint.x = this._startPoint.x + movement.newX;
     this._prevPoint.y = this._startPoint.y + movement.newY;
     return {
       x: this._prevPoint['x'],
       y: this._prevPoint['y']
     }
   };
  
  
   detectMovements(){
      if(faceLandmarksValues==null || faceLandmarksValues.length==0) return;
  
      this._canvas.generateTexture('canvas');
      this._canvas.clear().setFlipX(true);
  
      for (const landmarks of faceLandmarksValues) {
  
        //console.log(landmarks);
        this._drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_TESSELATION,
          { color: "#00365a70", lineWidth: 1 }
        );
        this._drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
          { color: "#00365a" }
        );
        this._drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
          { color: "#00365a" }
        );
        this._drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
          { color: "#00365a" }
        );
        this._drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
          { color: "#00365a" }
        );
        this._drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
          { color: "#00365a" }
        );
        this._drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_LIPS,
          { color: "#00365a" }
        );
        this._drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
          { color: "#00ff00" }
        );
        this._drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
          { color: "#00ff00" }
        );
      }
  
  
    const { x, y } = this.detectMovement(faceLandmarksValues[0][8]);
  
    const newX = this.game.canvas.width - (x *  this.game.canvas.width ); // Mirror camera
    const newY = (y * this.game.canvas.height); 
  
    this._aim.x=Phaser.Math.Clamp(newX, 10, 590);
    this._aim.y=Phaser.Math.Clamp(newY, 10, 1014);
   
   }

  update(time: number, delta: number): void {
    
   
    this.checkBlendShapeValues();
    
    if(this._rendering) this.detectMovements();

   

  }




}
