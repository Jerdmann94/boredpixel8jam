import Phaser from 'phaser';
export default class MoveLeft {
  // /** @type {Phaser.Physics.Arcade.Sprite} */
  // player
  //
  // /**
  //  * @param {Phaser.Physics.Arcade.Sprite} player
  //  */
  constructor(player) {
    this.player = player;
  }

  enter() {
    this.player.play('left-walk');

    sprite.setFlipX(true);

    // Don't let the player push things left if they in the air
    if (!(isInAir && this.isTouching.left)) {
      sprite.applyForce({ x: -moveForce, y: 0 });
    }
    const speed = 200;
    this.player.setVelocity(-speed, 0);
  }
}
