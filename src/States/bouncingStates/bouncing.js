import Phaser from 'phaser';
export default class bouncing {
  // /** @type {Phaser.Physics.Matter.Matter} */
  // player
  //
  // /**
  //  * @param {Phaser.Physics.Matter.Matter} player
  //  */
  player;
  name;
  x;
  y;
  constructor(player, x, y) {
    this.player = player;
    this.x = x;
    this.y = y;
    this.name = 'bouncing';
  }

  onStateEnter() {
    this.player.sprite.anims.play('player-jump');
    this.player.sprite.setVelocityY(-8);
    this.player.canJump = false;
    this.player.jumpCooldownTimer = this.player.scene.time.addEvent({
      delay: 250,
      callback: () => (this.player.canJump = true),
    });
  }

  onStateUpdate() {}
  onStateExit() {}
}
