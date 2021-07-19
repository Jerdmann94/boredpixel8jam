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

  onStateEnter() {
    this.player.sprite.setVelocityY(-8);
    this.player.canJump = false;
    this.player.jumpCooldownTimer = this.player.scene.time.addEvent({
      delay: 250,
      callback: () => (this.player.canJump = true),
    });
    console.log('jump state entered');
  }

  onStateUpdate() {}
  onStateExt() {}
}
