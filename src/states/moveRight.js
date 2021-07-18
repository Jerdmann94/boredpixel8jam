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

  enter() {
    this.player.play('left-walk');
    sprite.setFlipX(false);
    const speed = 200;
    this.player.sprite.setVelocity(speed, 0);
    if (!(this.player.isInAir && this.isTouching.right)) {
      sprite.applyForce({ x: moveForce, y: 0 });
    }
  }
}
