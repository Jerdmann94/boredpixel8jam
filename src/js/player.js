import Phaser from 'phaser';
import MultiKey from './multi-key.js';
import MoveRight from '../states/moveRight';
import MoveLeft from '../states/moveLeft';
import idle from '../states/idle.js';
import jumping from '../states/jumping';
import notJumping from '../states/notJumping';

const RUN_VELOCITY = 2;
const JUMP_VELOCITY = 8;
export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;

    // Create the animations we need from the player spritesheet
    const anims = scene.anims;
    anims.create({
      key: 'player-idle',
      frames: anims.generateFrameNumbers('player', { start: 0, end: 0 }),
      frameRate: 3,
      repeat: -1,
    });
    anims.create({
      key: 'player-run',
      frames: anims.generateFrameNumbers('player', { start: 1, end: 3 }),
      frameRate: 12,
      repeat: -1,
    });

    // Create the physics-based sprite that we will move around and animate
    this.sprite = scene.matter.add.sprite(0, 0, 'player', 0);

    const { Body, Bodies } = Phaser.Physics.Matter.Matter; // Native Matter modules
    const { width: w, height: h } = this.sprite;
    const mainBody = Bodies.rectangle(8, 16, w * 0.6, h * 0.9, {
      chamfer: { radius: 10 },
    });
    this.sensors = {
      bottom: Bodies.rectangle(8, h * 0.5 + 15, w * 0.25, 2, {
        isSensor: true,
      }),
      left: Bodies.rectangle(-w * 0.35 + 8, 16, 2, h * 0.5, { isSensor: true }),
      right: Bodies.rectangle(w * 0.35 + 8, 16, 2, h * 0.5, { isSensor: true }),
    };
    const compoundBody = Body.create({
      parts: [
        mainBody,
        this.sensors.bottom,
        this.sensors.left,
        this.sensors.right,
      ],
      frictionStatic: 0,
      frictionAir: 0.02,
      friction: 0.1,
    });
    this.sprite
      .setExistingBody(compoundBody)
      .setOrigin(0.5, 0.5)
      .setFixedRotation() // Sets inertia to infinity so the player can't rotate
      .setPosition(x, y);

    // Track which sensors are touching something
    this.isTouching = { left: false, right: false, ground: false };

    // Jumping is going to have a cooldown
    this.canJump = true;
    this.jumpCooldownTimer = null;

    // Before matter's update, reset the player's count of what surfaces it is touching.
    scene.matter.world.on('beforeupdate', this.resetTouching, this);

    scene.matterCollision.addOnCollideStart({
      objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
      callback: this.onSensorCollide,
      context: this,
    });
    scene.matterCollision.addOnCollideActive({
      objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
      callback: this.onSensorCollide,
      context: this,
    });

    // Track the keys
    const { LEFT, RIGHT, UP, A, D, W } = Phaser.Input.Keyboard.KeyCodes;
    this.leftInput = new MultiKey(scene, [LEFT, A]);
    this.rightInput = new MultiKey(scene, [RIGHT, D]);
    this.jumpInput = new MultiKey(scene, [UP, W]);

    this.destroyed = false;
    this.scene.events.on('update', this.update, this);
    this.scene.events.once('shutdown', this.destroy, this);
    this.scene.events.once('destroy', this.destroy, this);

    this.states = {
      idle: new idle(this),
      moveLeft: new MoveLeft(this),
      moveRight: new MoveRight(this),
    };
    this.jumpState = {
      jumping: new jumping(this),
      notJumping: new notJumping(this),
    };
    this.setState('idle');
    this.setJumpState('notJumping');
  }

  setState(name) {
    if (this.currentState === this.states[name]) {
      return;
    }

    this.currentState = this.states[name];
    this.currentState.onStateEnter();
    console.log(this.currentState);
  }
  setJumpState(name) {
    if (this.currentJumpState === this.jumpState[name]) {
      return;
    }
    this.currentJumpState = this.jumpState[name];
    if (name == 'jumping') {
      this.currentJumpState.onStateEnter();
    }
  }

  onSensorCollide({ bodyA, bodyB, pair }) {
    // Watch for the player colliding with walls/objects on either side and the ground below, so
    // that we can use that logic inside of update to move the player.
    // Note: we are using the "pair.separation" here. That number tells us how much bodyA and bodyB
    // overlap. We want to teleport the sprite away from walls just enough so that the player won't
    // be able to press up against the wall and use friction to hang in midair. This formula leaves
    // 0.5px of overlap with the sensor so that the sensor will stay colliding on the next tick if
    // the player doesn't move.
    if (bodyB.isSensor) return; // We only care about collisions with physical objects
    if (bodyA === this.sensors.left) {
      this.isTouching.left = true;
      if (pair.separation > 0.5) this.sprite.x += pair.separation - 0.5;
    } else if (bodyA === this.sensors.right) {
      this.isTouching.right = true;
      if (pair.separation > 0.5) this.sprite.x -= pair.separation - 0.5;
    } else if (bodyA === this.sensors.bottom) {
      this.isTouching.ground = true;
    }
  }

  resetTouching() {
    this.isTouching.left = false;
    this.isTouching.right = false;
    this.isTouching.ground = false;
  }

  freeze() {
    this.sprite.setStatic(true);
  }

  update() {
    this.currentState.onStateUpdate();
    this.currentJumpState.onStateUpdate();

    if (this.destroyed) return;
  }

  destroy() {
    // Clean up any listeners that might trigger events after the player is officially destroyed
    this.scene.events.off('update', this.update, this);
    this.scene.events.off('shutdown', this.destroy, this);
    this.scene.events.off('destroy', this.destroy, this);
    if (this.scene.matter.world) {
      this.scene.matter.world.off('beforeupdate', this.resetTouching, this);
    }
    const sensors = [
      this.sensors.bottom,
      this.sensors.left,
      this.sensors.right,
    ];
    this.scene.matterCollision.removeOnCollideStart({ objectA: sensors });
    this.scene.matterCollision.removeOnCollideActive({ objectA: sensors });
    if (this.jumpCooldownTimer) this.jumpCooldownTimer.destroy();

    this.destroyed = true;
    this.sprite.destroy();
  }
}
