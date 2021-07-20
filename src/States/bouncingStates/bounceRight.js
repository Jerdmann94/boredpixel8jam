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

  onStateEnter() {
    this.player.sprite.anims.play('player-run');
    this.player.sprite.setFlipX(false);
  }
  onStateUpdate() {
    const sprite = this.player.sprite;
    const velocity = sprite.body.velocity;
    const isRightKeyDown = this.player.rightInput.isDown();
    const isLeftKeyDown = this.player.leftInput.isDown();

    if (isLeftKeyDown) {
      this.player.setState('moveLeft');
    } else if (isRightKeyDown) {
      const speed = 1.6;
      this.player.sprite.setVelocityX(speed);
    } else {
      this.player.setState('bounceIdle');
    }
    const isJumpKeyDown = this.player.jumpInput.isDown();
    const isOnGround = this.player.isTouching.ground;
  }
  onStateExit() {}
}
