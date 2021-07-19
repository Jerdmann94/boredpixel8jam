import Phaser from 'phaser';

export default class defaultState {
  // /** @type {Phaser.Physics.Arcade.Sprite} */
  player;
  x;
  y;
  constructor(player, x, y) {
    this.player = player;
    this.x = x;
    this.y = y;
    console.log(this.x, this.y);
  }
  onStateEnter() {
    console.log('enter default');
    const anims = this.player.scene.anims;
    anims.create({
      key: 'player-idle',
      frames: anims.generateFrameNumbers('player', { start: 5, end: 5 }),
      frameRate: 3,
      repeat: -1,
    });
    anims.create({
      key: 'player-run',
      frames: anims.generateFrameNumbers('player', { start: 0, end: 2 }),
      frameRate: 12,
      repeat: -1,
    });
    anims.create({
      key: 'player-jump',
      frames: anims.generateFrameNumbers('player', { start: 3, end: 5 }),
      frameRate: 12,
      repeat: 1,
    });
    this.player.anims = anims;

    this.player.createSprite('player', this.x, this.y);

    // Create the physics-based sprite that we will move around and animate
    //this.sprite = this.player.scene.matter.add.sprite(0, 0, 'player', 0);

    // const { Body, Bodies } = Phaser.Physics.Matter.Matter; // Native Matter modules
    // const { width: w, height: h } = this.sprite;
    // const mainBody = Bodies.rectangle(8, 16, w * 0.6, h * 0.9, {
    //     chamfer: { radius: 10 },
    // });
    // this.sensors = {
    //     bottom: Bodies.rectangle(8, h * 0.5 + 15, w * 0.25, 2, {
    //         isSensor: true,
    //     }),
    //     left: Bodies.rectangle(-w * 0.35 + 8, 16, 2, h * 0.5, { isSensor: true }),
    //     right: Bodies.rectangle(w * 0.35 + 8, 16, 2, h * 0.5, { isSensor: true }),
    // };
    // const compoundBody = Phaser.Physics.Matter.Matter.Body.create({
    //     parts: [
    //         mainBody,
    //         this.sensors.bottom,
    //         this.sensors.left,
    //         this.sensors.right,
    //     ],
    //     frictionStatic: 0,
    //     frictionAir: 0.02,
    //     friction: 0.1,
    // });
    // this.sprite
    //     .setExistingBody(compoundBody)
    //     .setOrigin(0.5, 0.5)
    //     .setFixedRotation() // Sets inertia to infinity so the player can't rotate
    //     .setPosition(this.x, this.y);
    // this.player.sprite = this.sprite;
    //
    // // Track which sensors are touching something
    // this.player.sprite.isTouching = { left: false, right: false, ground: false };
    //
    // // Jumping is going to have a cooldown
    // this.player.canJump = true;
    // this.player.jumpCooldownTimer = null;
    //
    // // Before matter's update, reset the player's count of what surfaces it is touching.
    // this.player.scene.matter.world.on('beforeupdate', this.player.resetTouching, this);
    //
    // this.player.scene.matterCollision.addOnCollideStart({
    //     objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
    //     callback: this.player.onSensorCollide,
    //     context: this,
    // });
    // this.player.scene.matterCollision.addOnCollideActive({
    //     objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
    //     callback: this.player.onSensorCollide,
    //     context: this,
    // });
  }
  onStateUpdate() {
    this.player.currentState.onStateUpdate();
    this.player.currentJumpState.onStateUpdate();
  }
  onStateExit() {}
}
