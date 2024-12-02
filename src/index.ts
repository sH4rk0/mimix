//importiamo la libreria phaser

declare global {
  interface Window { FaceDetection: any; }
}

import "phaser";

import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

//importiamo le nostre scene
import Boot from "./scenes/Boot";
import Preloader from "./scenes/Preloader";
import Game1 from "./scenes/Game1";
import Game2 from "./scenes/Game2";
import Game3 from "./scenes/Game3";
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import Hud from "./scenes/Hud";
import { GameData } from "./GameData";  

export let blendShapesValues: any[] = [];
export let faceLandmarksValues: any[] = [];
export let gameName: string = "Game1";
export let game: Phaser.Game = null;
export let webcamRunning: boolean = false;

let faceLandmarker:any;
let runningMode: "IMAGE" | "VIDEO" = "IMAGE";
const videoWidth = 200;
const video = document.getElementById("webcam") as HTMLVideoElement;
let lastVideoTime = -1;
let results:any = undefined;


export function modalClose(score:number):void {


  if(window.FaceDetection !== undefined) window.FaceDetection?.postMessage(JSON.stringify({score:score}));

}

export function enableCam() {
  if (!faceLandmarker) {
    console.log("Wait! faceLandmarker not loaded yet.");
    return;
  }

  if (webcamRunning === true) {
    webcamRunning = false;
   
  } else {
    webcamRunning = true;
   
  }

  // getUsermedia parameters.
  const constraints = {
    video: true
  };


  async function predictWebcam() {
   
    const radio = video.videoHeight / video.videoWidth;
    video.style.width = videoWidth + "px";
    video.style.height = videoWidth * radio + "px";
 
    // Now let's start detecting the stream.
    if (runningMode === "IMAGE") {
      runningMode = "VIDEO";
      await faceLandmarker.setOptions({ runningMode: runningMode });
    }
    let startTimeMs = performance.now();
    if (lastVideoTime !== video.currentTime) {
      lastVideoTime = video.currentTime;
      results = faceLandmarker.detectForVideo(video, startTimeMs);
    }
    if (results.faceLandmarks) {

      faceLandmarksValues = results.faceLandmarks;

      if(results.faceBlendshapes[0])
      blendShapesValues = results.faceBlendshapes[0].categories;

    
    }

   // Call this function again to keep predicting when the browser is ready.
    if (webcamRunning === true) {
      window.requestAnimationFrame(predictWebcam);
    }
  }


  
  // Activate the webcam stream.
  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    video.srcObject = stream;
    video.addEventListener("loadeddata", predictWebcam);
  });
}


async function createFaceLandmarker() {
  const filesetResolver = await FilesetResolver.forVisionTasks(
    "/assets/js/wasm"
  );
  faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
    baseOptions: {
     modelAssetPath: `/assets/modelAsset/face_landmarker.task`,
      delegate: "GPU"
    },
    outputFaceBlendshapes: true,
    runningMode,
    numFaces: 1
  });



}

//il listener per l'evento load della pagina
//questo evento viene lanciato quando la pagina è stata caricata
//e tutti gli elementi della pagina sono disponibili
window.addEventListener("load", () => {


  //get game property from querystring
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  gameName = urlParams.get("gameName");
if(gameName==null) gameName="Game1";
  console.log("gameName: " + gameName);

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    backgroundColor: GameData.globals.bgColor,
    parent: "my-game",
    scale: {
      mode: Phaser.Scale.FIT,
      width: GameData.globals.gameWidth,
      height: GameData.globals.gameHeight,
    },

    scene: [
      Boot,
      Preloader,
      Game1,
      Game2,
      Game3,
      Hud
    ],
    physics: {
      default: "arcade",
      arcade: { debug: GameData.globals.debug, }
    },
    
    
    plugins: {
      scene: [{
        key: 'rexUI',
        plugin: UIPlugin,
        mapping: 'rexUI'
      }]
    },
    input: {
      activePointers: 1,
      keyboard: true,
    },
    render: {
      pixelArt: false,
      antialias: true,
    },
  };

  

  createFaceLandmarker().then(() => {

    console.log("FaceLandmarker loaded");
    //inizializziamo il gioco passando la configurazione
    game = new Phaser.Game(config);
  });
  


});
