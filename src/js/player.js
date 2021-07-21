import Phaser from 'phaser';
import MultiKey from './multi-key.js';

import defaultState from '../States/MacroStates/defaultState';
import onFireState from '../States/MacroStates/onFireState';

import bouncingState from '../States/MacroStates/bouncingState';
import bouncing from '../States/bouncingStates/bouncing';
import { sceneEvents } from '../lib/EventsCenter';

export default class Player {
  temp = null;
  x;
  y;
  jumpStates;
  states;
  currentJumpState;

  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;

    this.macroStates = {
      default: new defaultState(this, x, y),
      onFire: new onFireState(this, x, y),
      bouncing: new bouncingState(this, x, y),
    };

    this.setMacroState('default');

    const { LEFT, RIGHT, UP, A, D, W, S, V, X } =
      Phaser.Input.Keyboard.KeyCodes;
    this.leftInput = new MultiKey(scene, [LEFT, A]);
    this.rightInput = new MultiKey(scene, [RIGHT, D]);
    this.jumpInput = new MultiKey(scene, [UP, W]);
    this.test = new MultiKey(scene, [S]);
    this.bouncy = new MultiKey(scene, [V]);
    this.return = new MultiKey(scene, [X]);

    this.destroyed = false;
    this.scene.events.on('update', this.update, this);
    this.scene.events.once('shutdown', this.destroy, this);
    this.scene.events.once('destroy', this.destroy, this);

    sceneEvents.emit('changedPlayerBody', this);
  }

  setMacroState(name) {
    if (this.currentMacroState === this.macroStates[name]) {
      return;
    }
    this.macroStates = {
      default: new defaultState(this, this.x, this.y),
      onFire: new onFireState(this, this.x, this.y),
      bouncing: new bouncingState(this, this.x, this.y),
    };

    this.currentMacroState = this.macroStates[name];
    // console.log(this.currentMacroState);
    this.currentMacroState.onStateEnter();
    //console.log(this)
    sceneEvents.emit('changedPlayerBody', this);
  }
  setState(name) {
    if (this.currentState === this.states[name]) {
      return;
    }

    this.currentState = this.states[name];
    // console.log(this.currentState);

    this.currentState.onStateEnter();
  }
  setJumpState(name) {
    if (this.currentJumpState === this.jumpStates[name]) {
      return;
    }
    if (this.currentJumpState) {
      this.currentJumpState.onStateExit();
    }
    this.currentJumpState = this.jumpStates[name];

    this.currentJumpState.onStateEnter();
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
    if (!this.sprite.body) {
      console.log('BODY IS GONE');
    }
    this.currentMacroState.onStateUpdate();

    this.x = this.sprite.body.position.x;
    this.y = this.sprite.body.position.y;

    if (this.destroyed) return;

    if (this.test.isDown()) {
      this.setMacroState('onFire');
    }
    if (this.return.isDown()) {
      this.setMacroState('default');
    }
    if (this.bouncy.isDown()) {
      this.setMacroState('bouncing');
    }
  }

  createSprite(key, x, y) {
    if (this.sprite) {
      console.log(this.sprite);
      this.temp = this.sprite;
      this.sprite = this.scene.matter.add.sprite(
        this.temp.body.position.x,
        this.temp.body.position.y,
        key,
        0
      );
      this.scene.cameras.main.startFollow(this.sprite);
      //this.temp.setActive(false).setVisible(false);
      //this.temp.body.destroy();
    } else {
      this.sprite = this.scene.matter.add.sprite(x, y, key, 0);
    }

    const { Body, Bodies } = Phaser.Physics.Matter.Matter; // Native Matter modules
    const { width: w, height: h } = this.sprite;
    const mainBody = Bodies.rectangle(8, 15, w * 0.4, h * 0.8, {
      chamfer: { radius: 15 },
    });
    this.sensors = {
      bottom: Bodies.rectangle(8, h * 0.5 + 12, w * 0.25, 2, {
        isSensor: true,
      }),
      left: Bodies.rectangle(-w * 0.35 + 12, 16, 2, h * 0.5, {
        isSensor: true,
      }),
      right: Bodies.rectangle(w * 0.35 + 4, 16, 2, h * 0.5, { isSensor: true }),
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
    this.scene.matter.world.on('beforeupdate', this.resetTouching, this);

    this.scene.matterCollision.addOnCollideStart({
      objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
      callback: this.onSensorCollide,
      context: this,
    });
    this.scene.matterCollision.addOnCollideActive({
      objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
      callback: this.onSensorCollide,
      context: this,
    });

    // Track the keys
    const { LEFT, RIGHT, UP, A, D, W, S, X } = Phaser.Input.Keyboard.KeyCodes;
    this.leftInput = new MultiKey(this.scene, [LEFT, A]);
    this.rightInput = new MultiKey(this.scene, [RIGHT, D]);
    this.jumpInput = new MultiKey(this.scene, [UP, W]);
    this.test = new MultiKey(this.scene, [S]);
    this.return = new MultiKey(this.scene, [X]);

    this.destroyed = false;
    this.scene.events.on('update', this.update, this);
    this.scene.events.once('shutdown', this.destroy, this);
    this.scene.events.once('destroy', this.destroy, this);

    if (this.temp) {
      this.sprite.setPosition(this.x, this.y);
      this.temp.setActive(false).setVisible(false);
      this.temp.body.destroy();
    }
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
  onPlayerCollide({ gameObjectB }) {
    if (!gameObjectB || !(gameObjectB instanceof Phaser.Tilemaps.Tile)) return;
    const tile = gameObjectB;
    if (tile.properties.lethal) {
      this.scene.unsubscribePlayerCollide();
      console.log(this);
      //this.freeze();
      this.sprite.setStatic(true);
      sceneEvents.emit('playerDeath');
    }

    //DEALING WITH BOUNCING STATE ON OBJECTS
    // if (this.currentJumpState instanceof bouncing){
    //   this.sprite.setVelocityY(-8);
    //   this.player.scene.time.addEvent({
    //     delay: 250,
    //     callback: () => (this.check = true,console.log('callback')),
    //   });
    //   if(this.check){
    //     this.counter += 1;
    //     this.check= false;
    //     console.log();
    //   }
    //   if(this.counter > 3) {
    //     this.player.setMacroState('default')
    //   }
    // }
  }
}
