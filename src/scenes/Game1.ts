
;
import Hud from "./Hud";



export default class GamePlay extends Phaser.Scene {
 

private bricks: Phaser.Physics.Arcade.StaticGroup;
private ball: Phaser.Physics.Arcade.Image;
private paddle: Phaser.Physics.Arcade.Image;
private _Hud:Hud;

  constructor() {
    super({
      key: "Game1",
    });
  }



  init(data: {  }) {

  
  }

  
  create() {

    this._Hud= this.scene.get("Hud") as Hud;
    this._Hud.setGame(this);
 

   //  Enable world bounds, but disable the floor
   this.physics.world.setBoundsCollision(true, true, true, false);
   this.cameras.main.setBackgroundColor(0xeef4fa);

   //  Create the bricks in a 10x6 grid
   this.bricks = this.physics.add.staticGroup({
       key: 'breakout', frame: [ 'blue1', 'red1', 'green1', 'yellow1', 'silver1', 'purple1' ],
       frameQuantity: 8,
       gridAlign: { width: 8, height: 6, cellWidth: 64, cellHeight: 32, x:45, y: 200 }
   });

   this.ball = this.physics.add.image(300, 950, 'breakout', 'ball1').setCollideWorldBounds(true).setBounce(1);
   this.ball.setData('onPaddle', true);

   this.paddle = this.physics.add.image(300, 1000, 'breakout', 'paddle1').setImmovable().setCollideWorldBounds(true);

   //  Our colliders
   this.physics.add.collider(this.ball, this.bricks, this.hitBrick, null, this);
   this.physics.add.collider(this.ball, this.paddle, this.hitPaddle, null, this);

   //  Input events
  /* this.input.on('pointermove',  (pointer:Phaser.Input.Pointer)=>
   {

       //  Keep the paddle within the game
       this.paddle.x = Phaser.Math.Clamp(pointer.x, 52, 600-52);

       if (this.ball.getData('onPaddle'))
       {
           this.ball.x = this.paddle.x;
       }

   }, this);

   this.input.on('pointerup',  (pointer: Phaser.Input.Pointer)=>
   {

    this.releaseBall();

   }, this);
   */

   let _text=this.add.text(300, 512, "Mouth left/right to move.\nLeft eye blink to start!", { fontFamily: "Roboto", fontSize: "20px", color: "#002F6C" }).setOrigin(.5, 0).setAlpha(1)

   this.tweens.add({

    targets:_text,
    delay: 3000,
    alpha:0,
   });

}


releaseBall(){

  if (this.ball.getData('onPaddle'))
    {
        this.ball.setVelocity(-75, -300);
        this.ball.setData('onPaddle', false);
    }
}


hitBrick (ball:any, brick:any)
{
    brick.disableBody(true, true);

    if (this.bricks.countActive() === 0)
    {
        this.resetLevel();
    }
}

resetBall ()
{
    this.ball.setVelocity(0);
    this.ball.setPosition(this.paddle.x, 950);
    this.ball.setData('onPaddle', true);
}

resetLevel ()
{
    this.resetBall();

    /*this.bricks.children.each((brick:Phaser.GameObjects.GameObject) =>
    {

        brick.enableBody(false, 0, 0, true, true);

    });
    */
}

hitPaddle (ball:any,paddle:any)
{
    let diff = 0;

    if (ball.x < paddle.x)
    {
        //  Ball is on the left-hand side of the paddle
        diff = paddle.x - ball.x;
        ball.setVelocityX(-10 * diff);
    }
    else if (ball.x > paddle.x)
    {
        //  Ball is on the right-hand side of the paddle
        diff = ball.x - paddle.x;
        ball.setVelocityX(10 * diff);
    }
    else
    {
        //  Ball is perfectly in the middle
        //  Add a little random X to stop it bouncing straight up!
        ball.setVelocityX(2 + Math.random() * 8);
    }
}


  update(time: number, delta: number): void {

    if (this.ball.y > 1024)
      {
          this.resetBall();
      }


      if (this.ball.getData('onPaddle'))
        {
            this.ball.x = this.paddle.x;
        }



      if(this._Hud!=null && this._Hud.isCameraActive()){

        this.moveStop();
  
        if(this._Hud!=null &&  this._Hud.getFaceObject().mouthLeft){
          this.moveLeft();}
        if(this._Hud!=null && this._Hud.getFaceObject().mouthRight){
          this.moveRight();}

          if(this._Hud!=null && this._Hud.getFaceObject().eyeBlinkLeft && this.ball.getData('onPaddle')){
            this.releaseBall();
          
          }
          
          
         
           
         
  
  
      }
    

  }

  moveStop(){
    this.paddle.setVelocityX(0);
  }

  moveLeft(){
    this.paddle.setVelocityX(-300);
  }

  moveRight(){
    this.paddle.setVelocityX(+300);
  }


}
