export default class bounceIdle {
  // /** @type {Phaser.Physics.Arcade.Sprite} */
  player;

  constructor(player) {
    this.player = player;
  }

  onStateEnter() {
    this.player.sprite.setVelocityX(0);
    this.player.sprite.anims.play(`player-idle`);
  }

  onStateUpdate() {
    this.player.sprite.anims.play(`player-idle`);
    const sprite = this.player.sprite;
    const velocity = sprite.body.velocity;
    const isRightKeyDown = this.player.rightInput.isDown();
    const isLeftKeyDown = this.player.leftInput.isDown();
    const isOnGround = this.player.isTouching.ground;

    if (isLeftKeyDown) {
      this.player.setState('moveLeft');
    } else if (isRightKeyDown) {
      this.player.setState('moveRight');
    } else {
      // console.log(this.player.jumpInput.isDown()&& this.player.canJump && this.player.isTouching.ground)
    }
  }

  onStateExit() {}
}
