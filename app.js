(function(canvas, context) {
  class Player {
    constructor() {
      this.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
      this.width = 100;
      this.height = 150;
      this.x = 0.1 * canvas.width;
      this.y = 0.9 * canvas.height - this.height;
      this.speedX = 10;
      this.speedY = 10;
    }
    update() {
      if (player.y < 0.9 * canvas.height - player.height && keys[38] == false) {
        player.y += player.speedY;
      }

      if (keys[38]) {
        player.y -= player.speedY;
      }
      if (keys[39]) {
        player.x += player.speedX;
      }
      if (keys[37]) {
        player.x -= player.speedX;
      }
    }
  }

  var player;
  var keys = [];
  setup();
  requestAnimationFrame(draw);

  function setup() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    context.lineWidth = 6;
    player = new Player();
    addEventListener("keydown", function (evt) {
      keys[evt.keyCode] = true;
    });
    document.body.addEventListener("keyup", function (e) {
      keys[e.keyCode] = false;
    });
  }

  function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    player.update();
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

  function drawPlayer (){
    context.beginPath();
    context.rect(player.x, player.y, player.width, player.height);
    context.stroke();
    context.closePath();
    context.beginPath();
    context.fillStyle = player.color;
    context.rect(player.x, player.y, player.width, player.height);
    context.fill();
    context.rect(player.x, player.y, player.width, 0.5 * player.height);
    context.stroke();
    context.closePath();
    context.beginPath();
    context.fillStyle = '#000000';
    context.rect(
      player.x + 0.2 * player.width, player.y + player.height / 6, 0.2 * player.width, player.height / 6);
    context.rect(
      player.x + 0.6 * player.width, player.y + player.height / 6, 0.2 * player.width, player.height / 6);
    context.fill();
    context.closePath();
  }
}(document.querySelector('canvas'),document.querySelector('canvas').getContext('2d')));
