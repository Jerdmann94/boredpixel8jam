import Phaser from 'phaser';

import Player from './player';

import map from '../assets/shortermap.json';
import tiles from '../assets/temp-tiles.png';
import shrek from '../assets/shrekatlas.png';

export default class Scene extends Phaser.Scene {
  preload() {
    this.load.tilemapTiledJSON('map', map);
    this.load.image('tiles', tiles);
    this.load.spritesheet('player', shrek, {
      frameWidth: 16,
      frameHeight: 32,
      margin: 0,
      spacing: 0,
    });
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

    this.unsubscribePlayerCollide = this.matterCollision.addOnCollideStart({
      objectA: this.player.sprite,
      callback: this.onPlayerCollide,
      context: this,
    });
  }

  onPlayerCollide({ gameObjectB }) {
    if (!gameObjectB || !(gameObjectB instanceof Phaser.Tilemaps.Tile)) return;

    const tile = gameObjectB;

    // Check the tile property set in Tiled (you could also just check the index if you aren't using
    // Tiled in your game)
    if (tile.properties.lethal) {
      // Unsubscribe from collision events so that this logic is run only once
      this.unsubscribePlayerCollide();

      this.player.freeze();
      const cam = this.cameras.main;
      cam.fade(250, 0, 0, 0);
      cam.once('camerafadeoutcomplete', () => this.scene.restart());
    }
  }
}
