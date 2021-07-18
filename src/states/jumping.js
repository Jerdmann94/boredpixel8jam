import Phaser from 'phaser';
export default class jumping {
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
    this.player.sprite.setVelocityY(-6);

    console.log(this.player.sprite.body.force.y);
    // Add a slight delay between jumps since the bottom sensor will still collide for a few
    // frames after a jump is initiated
    this.player.canJump = false;
    this.player.jumpCooldownTimer = this.player.scene.time.addEvent({
      delay: 250,
      callback: () => (this.player.canJump = true),
    });
  }
}
