export default class fireRight {
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
      this.player.setState('fireIdle');
    }
  }

  onStateExit() {}
}
