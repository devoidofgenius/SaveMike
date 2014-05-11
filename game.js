// Initialize Phaser, and creates a 400x490px game
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game_div', { preload: preload, create: create, update: update, render: render });


function preload() { 

    game.load.image('stars', 'assets/starfield.jpg');
    game.load.image('mike', 'assets/mike.png');
    game.load.image('ship', 'assets/boat.png');
    game.load.image('baddie', 'assets/reaver.png');

}

var starfield;
var mikeFrog;
var serenity;
var cursors;
var reaver;
var score = 0;
var scoreText;

function create() {

      game.world.setBounds(0, 0, 1920, 1200);

      game.physics.startSystem(Phaser.Physics.P2JS);
      game.physics.p2.setImpactEvents(true);
      game.physics.p2.defaultRestitution = 0.8;

      var playerCollisionGroup = game.physics.p2.createCollisionGroup();
      var frogCollisionGroup = game.physics.p2.createCollisionGroup();

      game.physics.p2.updateBoundsCollisionGroup();

      starfield = game.add.tileSprite(0, 0, 800, 600, 'stars');
      starfield.fixedToCamera = true;

      mikeFrog = game.add.group();
      mikeFrog.enableBody = true;
      mikeFrog.physicsBodyType = Phaser.Physics.P2JS;

      for (var i = 0; i < 25; i++)
        {
          var frogs = mikeFrog.create(game.world.randomX, game.world.randomY, 'mike');
          frogs.body.setCircle(16);

          frogs.body.setCollisionGroup(frogCollisionGroup);

          frogs.body.collides([frogCollisionGroup, playerCollisionGroup]);

        }

        serenity = game.add.sprite(200, 200, 'ship')

        game.physics.p2.enable(serenity, false);
        serenity.body.setCircle(28);
        game.camera.follow(serenity);

        serenity.body.setCollisionGroup(playerCollisionGroup);

        serenity.body.collides(frogCollisionGroup, hitMikeFrog, this);

        scoreText = game.add.text(20, 20, score + ' of 25 Mikes Collected', { fontSize: '12px', fill: '#fff' });
        scoreText.fixedToCamera = true;

        cursors = game.input.keyboard.createCursorKeys();

    }


function hitMikeFrog (body1, body2) {
  
    body2.sprite.kill();

    score += 1;
    scoreText.setText(score + ' of 25 Mikes Collected');

    if (score == 25) {
      body1.sprite.kill();
      scoreText.setText("You saved all the Mikes!! \nClick to Replay");
      game.input.onTap.addOnce(restart,this);

    }
    
}

function restart () {

  score = 0;
  create();

}

    
function update() {

      if (cursors.left.isDown)
      {
      serenity.body.rotateLeft(100);
      }
      else if (cursors.right.isDown)
      {
      serenity.body.rotateRight(100);
      }
      else
      {
      serenity.body.setZeroRotation();
      }

      if (cursors.up.isDown)
      {
        serenity.body.thrust(400);
      }
      else if (cursors.down.isDown)
      {
          serenity.body.reverse(400);
      }

      if (!game.camera.atLimit.x)
      {
          starfield.tilePosition.x += (serenity.body.velocity.x * 16) * game.time.physicsElapsed;
      }

      if (!game.camera.atLimit.y)
      {
          starfield.tilePosition.y += (serenity.body.velocity.y * 16) * game.time.physicsElapsed;
      }

}

function render() {
/* 
  game.debug.text('Catch the Mikes!!', 32, 32);
*/
}
