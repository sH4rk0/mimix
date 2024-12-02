import path from "path";

export let GameData: gameData = {
  globals: {
    gameWidth: 600,
    gameHeight: 1024,
    bgColor: "#e3f4fa",
    debug: false,
    leaderboard:true,
    leaderboardcount: 10,
    leaderboardTable: "scores",
  },

  preloader: {
    bgColor: "002F6C",
    image: "logo",
    imageX: 600 / 2,
    imageY: 1024 / 2,
    loadingText: "Loading...",
    loadingTextFont: "ralewayRegular",
    loadingTextComplete: "Tap the icon to enable your camera!",
    loadingTextY: 800,
    loadingBarColor: 0x003658,
    loadingBarY: 1000,
  },



  spritesheets: [
    
    { name: "audio", path: "assets/images/hud/audio.png", width: 50, height: 50, frames: 2 },
    { name: "faces", path: "assets/images/hud/faces.png", width: 50, height: 50, frames: 2 },
  ],
  images: [

    { name: "close", path: "assets/images/hud/close.png" },
   

  ],



  atlas: [

    {
      key: "breakout",
      imagepath: "assets/images/game1/breakout.png",
      jsonpath: "assets/images/game1/breakout.json",
    }
    ],
  sounds: [
   
{
  name: "intro",
  paths: ["assets/sounds/intro.ogg","assets/sounds/intro.m4a"],


}
  ],

  videos: [],
  audios: [

    {
      name: "sfx",
      jsonpath: "assets/sounds/sfx.json",
      paths: ["assets/sounds/sfx.ogg", "assets/sounds/sfx.m4a"],
      instance: { instance: 10 }
    }
  ],

  scripts: [],
  /*fonts: [
   { key: 'Roboto' }, { key: 'Press+Start+2P' }, { key: 'Source+Sans+3' }
  ],
  
 localfonts:[{name:"raylwayRegular",path:"assets/fonts/raylway.regular.ttf"}],
 */
  bitmapfonts: [{
    name: "arcade2",
    imgpath: "assets/fonts/arcade2.png",
    xmlpath: "assets/fonts/arcade2.xml",
  }],
};
