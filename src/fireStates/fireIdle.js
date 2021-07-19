export default class fireIdle {
  player;
  x;
  y;

  constructor(player, x, y) {
    this.player = player;
    this.x = x;
    this.y = y;
  }
  onStateEnter() {
    this.player.sprite.setVelocityX(0);
    this.player.sprite.anims.play(`player-idle-fire`);
  }

  onStateUpdate() {
    this.player.sprite.anims.play(`player-run-fire`);
    const sprite = this.player.sprite;
    const velocity = sprite.body.velocity;
    const isRightKeyDown = this.player.rightInput.isDown();
    const isLeftKeyDown = this.player.leftInput.isDown();

    if (isLeftKeyDown) {
      this.player.setState('moveLeft');
    } else if (isRightKeyDown) {
      this.player.setState('moveRight');
    } else {
      // console.log(this.player.jumpInput.isDown()&& this.player.canJump && this.player.isTouching.ground)
    }

    if (
      this.player.jumpInput.isDown() &&
      this.player.canJump &&
      this.player.isTouching.ground
    ) {
      this.player.setJumpState('jumping');
    }
  }

  onStateExt() {}
}
