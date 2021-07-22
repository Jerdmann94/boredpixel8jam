import bounceIdle from '../bouncingStates/bounceIdle';
import bounceLeft from '../bouncingStates/bounceLeft';
import bounceRight from '../bouncingStates/bounceRight';
import bouncing from '../bouncingStates/bouncing';
import superBounce from '../bouncingStates/superBounce';
import Phaser from 'phaser';
import { sceneEvents } from '../../lib/EventsCenter';

export default class bouncingState {
  player;
  x;
  y;
  states;
  jumpStates;
  counter;
  check;

  constructor(player, x, y) {
    this.player = player;
    this.x = x;
    this.y = y;
    this.counter = 0;
    this.check = true;
    this.states = {
      bounceIdle: new bounceIdle(player, x, y),
      moveLeft: new bounceLeft(player, x, y),
      moveRight: new bounceRight(player, x, y),
    };
    this.jumpStates = {
      bouncing: new bouncing(player, x, y),
      superBounce: new superBounce(player, x, y),
    };
  }

  onStateEnter() {
    //console.log('entering bounce state');

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

    this.player.setState('bounceIdle');

    this.player.setJumpState('bouncing');
  }
  onStateUpdate() {
    this.player.currentState.onStateUpdate();
    this.player.currentJumpState.onStateUpdate();
  }
  onStateExit() {}
  bounce() {}
}
