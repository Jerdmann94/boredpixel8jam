import Phaser from 'phaser';
export default class bounceLeft {
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
      this.player.setState('bounceIdle');
    }
  }

  onStateExit() {}
}
