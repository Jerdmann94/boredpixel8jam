import Phaser from 'phaser';
import { sceneEvents } from '../../lib/EventsCenter';
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
    sceneEvents.on('bounce', this.bounce, this);
    this.player.sprite.anims.play('player-jump');
    this.player.sprite.setVelocityY(-8);
    this.player.canJump = false;
    this.player.jumpCooldownTimer = this.player.scene.time.addEvent({
      delay: 250,
      callback: () => (this.player.canJump = true),
    });
  }

  onStateUpdate() {
    if (this.player.jumpInput.isDown()) {
      this.player.setJumpState('superBounce');
    }
  }
  onStateExit() {}

  bounce() {
    if (this.player.currentJumpState instanceof bouncing) {
      this.player.sprite.setVelocityY(-6);
    }
  }
}
