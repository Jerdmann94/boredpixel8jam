import Phaser from 'phaser';
import Scene from './js/scene.js'
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin'


const config = {
    type: Phaser.AUTO,
    width: 448,
    height: 224,
    backgroundColor: "#000c1f",
    parent: "game-container",
    scene: Scene,
    pixelArt: true,
    physics: { default: "matter" },
    plugins: {
        scene: [
            {
                plugin: PhaserMatterCollisionPlugin, // The plugin class
                key: "matterCollision", // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
                mapping: "matterCollision" // Where to store in the Scene, e.g. scene.matterCollision
            }
        ]
    }
};

const game = new Phaser.Game(config);
