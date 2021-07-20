import Phaser from 'phaser';

export default class defaultState {
  // /** @type {Phaser.Physics.Arcade.Sprite} */
  player;
  x;
  y;

  constructor(player, x, y) {
    this.player = player;
    this.x = x;
    this.y = y;
    console.log(this.x, this.y);
  }

  onStateEnter() {
    console.log('enter default');
    const anims = this.player.scene.anims;
    anims.create({
      key: 'player-idle',
      frames: anims.generateFrameNumbers('player', { start: 5, end: 5 }),
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
      frames: anims.generateFrameNumbers('player', { start: 3, end: 5 }),
      frameRate: 12,
      repeat: 1,
    });
    this.player.anims = anims;

    this.player.createSprite('player', this.x, this.y);

    //SETTING SCENE'S PLAYER TO THIS PLAYER FOR COLLISIONS
    this.player.scene.unsubscribePlayerCollide =
      this.player.scene.matterCollision.addOnCollideStart({
        objectA: this.player.sprite,
        callback: this.player.currentMacroState.onPlayerCollide,
        context: this.player.scene,
      });
  }

  onStateUpdate() {
    this.player.currentState.onStateUpdate();
    this.player.currentJumpState.onStateUpdate();
  }

  onStateExit() {}

  //COLLISION FUNCTION
  onPlayerCollide({ gameObjectB }) {
    if (!gameObjectB || !(gameObjectB instanceof Phaser.Tilemaps.Tile)) return;

    console.log('colliding with stuff');
    const tile = gameObjectB;

    // Check the tile property set in Tiled (you could also just check the index if you aren't using
    // Tiled in your game)
    if (tile.properties.lethal) {
      console.log('inside tile lethal');
      // Unsubscribe from collision events so that this logic is run only once
      this.player.scene.unsubscribePlayerCollide();

      this.player.freeze();
      this.player.scene.cameras.main.fade(250, 0, 0, 0);
      this.player.scene.cameras.main.on(
        'camerafadeoutcomplete',
        function () {
          this.scene.restart();
          console.log('scene should be restarting');
        },
        this
      );
      // const cam = this.player.scene.cameras.main;
      //
      // cam.once('camerafadeoutcomplete', () => this.player.scene.restart());
    }
  }
}
