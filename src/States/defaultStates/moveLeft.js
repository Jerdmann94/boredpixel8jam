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

  onStateEnter() {
    this.player.sprite.anims.play('player-run');
    this.player.sprite.setFlipX(true);
  }

  onStateUpdate() {
    const sprite = this.player.sprite;
    const velocity = sprite.body.velocity;
    const isRightKeyDown = this.player.rightInput.isDown();
    const isLeftKeyDown = this.player.leftInput.isDown();
    const isJumpKeyDown = this.player.jumpInput.isDown();
    const isOnGround = this.player.isTouching.ground;

    if (isLeftKeyDown) {
      const speed = 1.6;
      this.player.sprite.setVelocityX(-speed);
    } else if (isRightKeyDown) {
      this.player.setState('moveRight');
    } else {
      this.player.setState('idle');
    }
    if (
      this.player.jumpInput.isDown() &&
      this.player.canJump &&
      this.player.isTouching.ground
    ) {
      this.player.setJumpState('jumping');
    }

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

  onStateExit() {}
}
