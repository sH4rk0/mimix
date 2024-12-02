
;
import Hud from "./Hud";



export default class GamePlay extends Phaser.Scene {
 


private _Hud:Hud;

  constructor() {
    super({
      key: "Game2",
    });
  }



  init(data: {  }) {

  
  }

  
  create() {

    this._Hud= this.scene.get("Hud") as Hud;
    this._Hud.setGame(this);


    this.add.text(300,512,"Game2",{fontSize:"32px",color:"#000"});

}





  update(time: number, delta: number): void {

   


  
    

  }

  


}
