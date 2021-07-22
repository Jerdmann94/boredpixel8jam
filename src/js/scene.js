import Phaser from 'phaser';

import Player from './player';
import trap from '../assets/trap.png';
import map from '../assets/map4.json';
import tiles from '../assets/tilesheet.png';
import gobdefault from '../assets/goblinsheet.png';
import Slopes from 'phaser-slopes';
import fireIdle from '../assets/firegoblinidle.png';
import firewalk from '../assets/firegoblinwalk.png';
import { sceneEvents } from '../lib/EventsCenter';
import _ from 'lodash';

export default class Scene extends Phaser.Scene {
  preload() {
    this.load.tilemapTiledJSON('map', map);
    this.load.image('tiles', tiles);
    this.load.image('trap', trap);
    this.load.spritesheet('player', gobdefault, {
      frameWidth: 32,
      frameHeight: 32,
      margin: 0,
      spacing: 0,
    });
    this.load.spritesheet('fireidle', fireIdle, {
      frameWidth: 32,
      frameHeight: 32,
      margin: 0,
      spacing: 0,
    });
    this.load.spritesheet('firewalk', firewalk, {
      frameWidth: 32,
      frameHeight: 32,
      margin: 0,
      spacing: 0,
    });

    this.load.scenePlugin('Slopes', Slopes);
  }

  create() {
    sceneEvents.on(
      'changedPlayerBody',
      _.debounce(this.setPlayerCollision, 400, {
        leading: true,
      }),
      this
    );
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('tilesheet', 'tiles');
    const trapset = map.addTilesetImage('trap', 'trap');

    this.worldLayer = map.createLayer('Tile Layer 1', [tileset]);
    this.spikeLayer = map.createLayer('spikes', [trapset]);

    this.worldLayer.setCollisionByProperty({
      collides: true,
      lethal: true,
      spikes: true,
    });

    this.matter.world.convertTilemapLayer(this.worldLayer);

    const spawnPoint = map.findObject('spawnPoint', (obj) => obj.name === '');
    let i = 0;
    const { Body, Bodies } = Phaser.Physics.Matter.Matter;

    map.getObjectLayer('spikes').objects.forEach((spike) => {
      if (spike.name == 'spawnPoint') {
      } else {
        const { x, y, width, height } = spike;

        spike.sprite = this.matter.add.sprite(x + width / 2, y - 32, 'trap');

        const mainBody = Bodies.rectangle(x + 16, y - 24, 26, 12, {
          chamfer: { radius: 0 },
          isStatic: true,
        });
        spike.sprite.setExistingBody(mainBody).setOrigin(0.5, 0.75);

        i++;
        spike.sprite.name = 'spike';
      }
    });

    this.player = new Player(this, spawnPoint.x, spawnPoint.y);

    // Smoothly follow the player
    this.cameras.main.startFollow(this.player.sprite);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.matter.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    sceneEvents.once(
      'playerDeath',
      function () {
        this.playerDeath();
      },
      this
    );
  }

  playerDeath() {
    this.cameras.main.fade(250, 0, 0, 0);
    this.cameras.main.on(
      'camerafadeoutcomplete',
      function () {
        this.scene.restart();
      },
      this
    );
  }
  setPlayerCollision(player) {
    this.unsubscribePlayerCollide = this.matterCollision.addOnCollideStart({
      objectA: player.sprite,
      callback: player.onPlayerCollide,
      context: player,
    });
  }
}
