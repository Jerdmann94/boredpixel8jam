import fireLeft from '../fireStates/fireLeft';
import fireRight from '../fireStates/fireRight';
import fireNotJumping from '../fireStates/fireNotJumping';
import fireIdle from '../fireStates/fireIdle';
import Phaser from 'phaser';

export default class onFireState {
  // /** @type {Phaser.Physics.Arcade.Sprite} */
  player;
  x;
  y;
  states;
  jumpStates;

  constructor(player, x, y) {
    this.player = player;
    this.x = x;
    this.y = y;
    this.states = {
      fireIdle: new fireIdle(player, x, y),
      moveLeft: new fireLeft(player, x, y),
      moveRight: new fireRight(player, x, y),
    };
    this.jumpStates = {
      fireNotJumping: new fireNotJumping(player, x, y),
    };
  }
  onStateEnter() {
    const anims = this.player.scene.anims;
    anims.create({
      key: 'player-idle-fire',
      frames: anims.generateFrameNumbers('shrek', { start: 0, end: 0 }),
      frameRate: 3,
      repeat: -1,
    });
    anims.create({
      key: 'player-run-fire',
      frames: anims.generateFrameNumbers('shrek', { start: 0, end: 3 }),
      frameRate: 12,
      repeat: -1,
    });

    this.player.anims = anims;
    this.player.createSprite('player', this.x, this.y);

    this.player.states = this.states;
    this.player.jumpStates = this.jumpStates;
    console.log(this.player.jumpStates);
    this.player.setState('fireIdle');
    this.player.setJumpState('fireNotJumping');
  }
  onStateUpdate() {
    this.player.currentState.onStateUpdate();
    this.player.currentJumpState.onStateUpdate();
  }
  onStateExit() {}
}
