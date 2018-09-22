(function(canvas, context) {
  class Player {
    constructor() {
      this.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
      this.width = 60;
      this.height = 90;
      this.x = 0.1 * canvas.width;
      this.y = 0.9 * canvas.height - this.height;
      this.speedX = 0;
      this.speedY = 0;
      this.left = false;
      this.right = false;
      this.up = false;
      this.jumping = false;
    }
  }

  function update() {
    if (player.up == true && player.jumping == false) {

      player.speedY -= 50;
      player.jumping = true;

    }

    if (player.left == true) {

      player.speedX -= 3;

    }

    if (player.right == true) {

      player.speedX += 3;

    }
    player.speedY += 2.5;
    player.x += player.speedX;
    player.y += player.speedY;
    player.speedX *= 0.9;
    player.speedX *= 0.9;

    if (player.y > 0.9 * canvas.height - player.height) {

      player.jumping = false;
      player.y = 0.9 * canvas.height - player.height;
      player.speedY = 0;

    }
  }
  var player;
  var keys = [];
  var img = new Image();
  img.src = 'animation1.png';
  setup();
  requestAnimationFrame(draw);

  function setup() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    context.imageSmoothingEnabled = false;
    player = new Player();
    addEventListener("keydown", keyListener);
    document.body.addEventListener("keyup", keyListener);
  }

  function keyListener(evt) {

    var key_state = (evt.type == "keydown") ? true : false;

    switch (evt.keyCode) {

      case 37:
        player.left = key_state;
        break;
      case 38:
        player.up = key_state;
        break;
      case 39:
        player.right = key_state;
        break;
    }
  }

  function draw() {
    update();
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawPlayer();
    requestAnimationFrame(draw);
  }

  function drawBackground() {
    context.beginPath();
    context.fillStyle = '#000000';
    context.rect(0, 0.9 * canvas.height, canvas.width, 0.1 * canvas.height);
    context.fill();
    context.closePath();
  }

  function drawPlayer() {
    context.beginPath();
    context.drawImage(img, player.x, player.y, player.width, player.height);
    context.closePath();
  }
}(document.querySelector('canvas'), document.querySelector('canvas').getContext('2d')));
