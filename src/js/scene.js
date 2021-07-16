import Phaser from "phaser";
import Player from "./player"
export default class Scene extends Phaser.Scene {


    preload() {

        this.load.tilemapTiledJSON("map", "src/assets/newtemp.json");
        this.load.image('tile3',"src/assets/tile3.png");
        this.load.spritesheet(
            "player",
            "src/assets/shrekatlas.png",
            {
                frameWidth: 16,
                frameHeight: 32,
                margin: 0,
                spacing: 0
            }
        );
    }

    create() {
        const map = this.make.tilemap({key: "map"});
        const tileset = map.addTilesetImage('tile 3','tile3')
        const platform = map.createLayer('TempLayer', tileset,0,0);
        platform.setCollisionByProperty({collides:true});

        const debugGraphics = this.add.graphics().setAlpha(0.75);
        platform.renderDebug(debugGraphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        });
        this.matter.world.convertTilemapLayer(platform);
        // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
        // Phaser's cache (i.e. the name you used in preload)
       // const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");

        this.player = new Player(this, 40, 0);

        // Smoothly follow the player
        this.cameras.main.startFollow(this.player.sprite, false, 0.5, 0.5);
    }
}