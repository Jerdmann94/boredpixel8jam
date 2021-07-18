import Phaser from 'phaser';
export default class MoveLeft {
  // /** @type {Phaser.Physics.Arcade.Sprite} */
  player;
  //
  // /**
  //  * @param {Phaser.Physics.Arcade.Sprite} player
  //  */
  constructor(player) {
    this.player = player;
  }

  enter() {
    const moveForce = this.player.isTouching.ground ? 0.01 : 0.005;
    this.player.sprite.anims.play('player-run');

    this.player.sprite.setFlipX(true);

    // Don't let the player push things left if they in the air
    if (!(this.player.isTouching.ground && this.player.isTouching.left)) {
      //this.player.sprite.applyForce({ x: -moveForce, y: 0 });
    }
    const speed = 200;
    this.player.sprite.setVelocityX(-speed);
    if (this.player.sprite.body.velocity.x > 7)
      this.player.sprite.setVelocityX(7);
    else if (this.player.sprite.body.velocity.x < -7)
      this.player.sprite.setVelocityX(-7);
  }
}
