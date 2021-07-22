import Phaser from 'phaser';
import idle from '../defaultStates/idle';
import MoveLeft from '../defaultStates/moveLeft';
import MoveRight from '../defaultStates/moveRight';
import jumping from '../defaultStates/jumping';
import notJumping from '../defaultStates/notJumping';

export default class defaultState {
  // /** @type {Phaser.Physics.Arcade.Sprite} */
  player;
  x;
  y;
  states;
  jumpState;

  constructor(player, x, y) {
    this.player = player;
    this.x = x;
    this.y = y;
    this.states = {
      idle: new idle(this.player),
      moveLeft: new MoveLeft(this.player),
      moveRight: new MoveRight(this.player),
    };
    this.jumpStates = {
      jumping: new jumping(this.player),
      notJumping: new notJumping(this.player),
    };
  }

  onStateEnter() {
    const anims = this.player.scene.anims;
    anims.create({
      key: 'player-idle',
      frames: anims.generateFrameNumbers('player', { start: 0, end: 0 }),
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
      frames: anims.generateFrameNumbers('player', { start: 3, end: 4 }),
      frameRate: 12,
      repeat: 1,
    });
    this.player.anims = anims;
    const args = ['player', this.x, this.y];

    this.player.states = this.states;
    this.player.jumpStates = this.jumpStates;
    //console.log(this.player.sprite);
    this.player.createSprite.apply(this.player, args);
    this.player.setState('idle');
    this.player.setJumpState('notJumping');
  }

  onStateUpdate() {
    this.player.currentState.onStateUpdate();
    this.player.currentJumpState.onStateUpdate();
  }

  onStateExit() {}
}
