//importiamo la classe GameData

import { GameData } from "../GameData";

import WebFontFile from '../scenes/webFontFile';
import Hud from "./Hud";

import {gameName} from "../index";

export default class Preloader extends Phaser.Scene {

  private _Hud:Hud;
  private _loading: Phaser.GameObjects.Text;
  private _progress: Phaser.GameObjects.Graphics;
  private _image: Phaser.GameObjects.Image;
  private _preload: Phaser.GameObjects.Image;
  private _smile: boolean;

  constructor() {
    super({
      key: "Preloader",
    });
  }

  preload() {
    this.cameras.main.setBackgroundColor(GameData.globals.bgColor);
    this._progress = this.add.graphics();
    this.loadAssets();
  }

  

  init() {
    this._Hud = this.scene.get("Hud") as Hud;
    
    this._image = this.add
      .image(
        GameData.preloader.imageX,
        GameData.preloader.imageY-50,
        GameData.preloader.image
      )
      .setAlpha(0).setScale(.75);

    this._preload= this.add
    .image(
      GameData.preloader.imageX,
      GameData.preloader.imageY,
      "atom"
    )
    .setAlpha(1).setScale(1.5);

    this.tweens.add({
      targets: [this._preload],
      rotation: 360,
      duration: 30000,
      repeat: -1,
    });
    

    this._loading = this.add
      .text(this.game.canvas.width / 2, GameData.preloader.loadingTextY, "")
      .setAlpha(1)
      .setDepth(1001)
      .setOrigin(0.5, 1).setColor("#003658").setFontSize(20).setFontFamily(GameData.preloader.loadingTextFont);
  }


  
  checkLeaderboard() {

      this._Hud.setUp();

      this._loading.setText(GameData.preloader.loadingTextComplete);
      this.tweens.add({
        targets: [this._preload],
        alpha: 0,
        duration: 500,
      });


      this._progress.clear();
     
  
  }


  startGame() {

   if(this._smile) return;
    this._smile=true;
    this.scene.start(gameName);
   
   
  }


  create(){}



  loadAssets(): void {
    this.load.on("start", () => { });

    this.load.on("fileprogress", (file: any, value: any) => {

    });

    this.load.on("progress", (value: number) => {

      this._progress.clear();
      this._progress.fillStyle(GameData.preloader.loadingBarColor, 1);
      this._progress.fillRect(0, GameData.preloader.loadingBarY, GameData.globals.gameWidth * value, 70);
      this._loading.setText(GameData.preloader.loadingText + " " + Math.round(value * 100) + "%");
    });

  
      this.load.on("complete", () => {


        this.checkLeaderboard();
       

        /*this._timer = this.time.addEvent({
          delay: 1000,
          callback: this.checkLeaderboard,
          callbackScope: this,
          repeat: -1,
        });*/


      });
  

    if (GameData.fonts != null) {
      let _fonts: Array<string> = [];
      GameData.fonts.forEach((element: FontAsset) => {
        _fonts.push(element.key);
      });
      this.load.addFile(new WebFontFile(this.load, _fonts));
    }


    //SCRIPT
    if (GameData.scripts != null)
      GameData.scripts.forEach((element: ScriptAsset) => {
        this.load.script(element.key, element.path);
      });

    // IMAGES
    if (GameData.images != null)
      GameData.images.forEach((element: ImageAsset) => {
        this.load.image(element.name, element.path);
      });

    // TILEMAPS
    if (GameData.tilemaps != null)
      GameData.tilemaps.forEach((element: TileMapsAsset) => {
        this.load.tilemapTiledJSON(element.key, element.path);
      });

    // ATLAS
    if (GameData.atlas != null)
      GameData.atlas.forEach((element: AtlasAsset) => {
        this.load.atlas(element.key, element.imagepath, element.jsonpath);
      });

    // SPRITESHEETS
    if (GameData.spritesheets != null)
      GameData.spritesheets.forEach((element: SpritesheetsAsset) => {
        this.load.spritesheet(element.name, element.path, {
          frameWidth: element.width,
          frameHeight: element.height,
          endFrame: element.frames,
        });
      });

    //video 
    if (GameData.videos != null) {
      GameData.videos.forEach((element: VideoAsset) => {
        console.log(element);
        this.load.video(element.name, element.path, true);
      });
    }

    //bitmap fonts
    if (GameData.bitmapfonts != null)
      GameData.bitmapfonts.forEach((element: BitmapfontAsset) => {
        this.load.bitmapFont(element.name, element.imgpath, element.xmlpath);
      });

    // SOUNDS
    if (GameData.sounds != null)
      GameData.sounds.forEach((element: SoundAsset) => {
        this.load.audio(element.name, element.paths);
      });

    // Audio
    if (GameData.audios != null)
      GameData.audios.forEach((element: AudioSpriteAsset) => {
        this.load.audioSprite(
          element.name,
          element.jsonpath,
          element.paths,
          element.instance
        );
      });

    
  }


  update(time: number, delta: number): void {


    if(this._Hud.isCameraActive() && !this._Hud.isDataFlowing()){
      this._loading.setText("Enabling camera....");
    }

    if(this._Hud!=null && this._Hud.isCameraActive() && this._Hud.isDataFlowing()){
      this._loading.setText("Smile to start!");

      if(this._Hud!=null &&  this._Hud.getFaceObject().smile){
        this.startGame();
      }
     
    }
  
  
  }


 
}

