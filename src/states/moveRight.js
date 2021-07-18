import Phaser from 'phaser';
export default class MoveRight {
  // /** @type {Phaser.Physics.Matter.Matter} */
  // player
  //
  // /**
  //  * @param {Phaser.Physics.Matter.Matter} player
  //  */
  constructor(player) {
    this.player = player;
  }

  enter() {
    const moveForce = this.player.isTouching.ground ? 0.01 : 0.005;
    this.player.sprite.anims.play('player-run');
    this.player.sprite.setFlipX(false);
    const speed = 200;
    this.player.sprite.setVelocityX(speed);
    if (!(this.player.isTouching.ground && this.player.isTouching.right)) {
      //this.player.sprite.applyForce({ x: moveForce, y: 0 });
    }
    if (this.player.sprite.body.velocity.x > 7)
      this.player.sprite.setVelocityX(7);
    else if (this.player.sprite.body.velocity.x < -7)
      this.player.sprite.setVelocityX(-7);
  }
}
