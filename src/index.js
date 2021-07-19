import Phaser from 'phaser';
import Scene from './js/scene.js';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';

const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 320,
  zoom: 2,
  backgroundColor: '#87CEFA',
  parent: 'game-container',
  scene: Scene,
  pixelArt: true,
  physics: {
    default: 'matter',
    matter: {
      debug: {
        showBody: true,
        showStaticBody: true,
        showBounds: true,
        boundsColor: 0xffffff,
      },
    },
  },
  plugins: {
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin, // The plugin class
        key: 'matterCollision', // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
        mapping: 'matterCollision', // Where to store in the Scene, e.g. scene.matterCollision
      },
    ],
  },
};

const game = new Phaser.Game(config);
