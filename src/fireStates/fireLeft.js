export default class fireLeft {
  player;
  x;
  y;

  constructor(player, x, y) {
    this.player = player;
    this.x = x;
    this.y = y;
  }
  onStateEnter() {
    this.player.sprite.anims.play('player-run-fire');
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
      this.player.setState('fireIdle');
    }
  }

  onStateExt() {}
}
