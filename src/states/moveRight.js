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
      this.player.setState('idle');
    }
    const isJumpKeyDown = this.player.jumpInput.isDown();
    const isOnGround = this.player.isTouching.ground;
    if (
      this.player.jumpInput.isDown() &&
      this.player.canJump &&
      this.player.isTouching.ground
    ) {
      this.player.setJumpState('jumping');
    }

    // Update the animation/texture based on the state of the player's state
    if (isOnGround) {
      this.player.setJumpState('notJumping');
    }
    //   //if (sprite.body.force.x !== 0) sprite.anims.play('player-run', true);
    //   else sprite.anims.play('player-idle', true);
    // } else {
    //   sprite.anims.stop();
    //   sprite.setTexture('player', 5);
    // }
  }
  onStateExt() {}
}
