import Phaser from 'phaser';
import { sceneEvents } from '../../lib/EventsCenter';
export default class SuperBounce {
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
    sceneEvents.on('bounce', this.returnToDefault, this);
    this.player.sprite.anims.play('player-jump');
    this.player.sprite.setVelocityY(-14);
    this.player.canJump = false;
    this.player.jumpCooldownTimer = this.player.scene.time.addEvent({
      delay: 250,
      callback: () => (this.player.canJump = true),
    });
    //this.player.setMacroState('default');
  }

  onStateUpdate() {}
  onStateExit() {}
  returnToDefault() {
    if (this.player.currentJumpState instanceof SuperBounce) {
      this.player.setMacroState('default');
    }
  }
}
