import Phaser from 'phaser';

import Player from './player';

import map from '../assets/shortermap.json';
import tiles from '../assets/temp-tiles.png';
import gobdefault from '../assets/goblinsheet.png';
import Slopes from 'phaser-slopes';
import shrek from '../assets/shrekatlas.png';
import { sceneEvents } from '../lib/EventsCenter';
import _ from 'lodash';
export default class Scene extends Phaser.Scene {
  preload() {
    this.load.tilemapTiledJSON('map', map);
    this.load.image('tiles', tiles);
    this.load.spritesheet('player', gobdefault, {
      frameWidth: 32,
      frameHeight: 32,
      margin: 0,
      spacing: 0,
    });
    this.load.spritesheet('shrek', shrek, {
      frameWidth: 16,
      frameHeight: 32,
      margin: 0,
      spacing: 0,
    });
    this.load.scenePlugin('Slopes', Slopes);
  }

  create() {
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('temp-tiles', 'tiles');
    this.worldLayer = map.createLayer('world', tileset);
    this.worldLayer.setCollisionByProperty({ collides: true, lethal: true });

    this.matter.world.convertTilemapLayer(this.worldLayer);

    const spawnPoint = map.findObject(
      'objects',
      (obj) => obj.name === 'player-spawn'
    );
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

    sceneEvents.on(
      'changedPlayerBody',
      _.debounce(this.setPlayerCollision, this, 2000, {
        leading: true,
        trailing: false,
      }),
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
    console.log(player);
    console.log(this);
    this.unsubscribePlayerCollide = this.matterCollision.addOnCollideStart({
      objectA: player.sprite,
      callback: this.player.onPlayerCollide,
      context: this.player,
    });
  }
}
