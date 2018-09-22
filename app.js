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
      this.isLeft = false;
      this.isRight = false;
      this.isUp = false;
      this.isJumping = false;
    }

    update() {
      if (this.isUp && !this.isJumping) {
        this.speedY -= 35;
        this.isJumping = true;
        if (this.isLeft) this.speedX -= 20;
        if (this.isRight) this.speedX += 20;
       }

      if (this.isLeft) {
        this.speedX -= 1.5;
      }

      if (this.isRight) {
        this.speedX += 1.5;
      }

      this.speedY += 2.5;
      this.x += this.speedX;
      this.y += this.speedY;
      this.speedX *= 0.9;
      this.speedX *= 0.9;

      if (this.y > 0.9 * canvas.height - this.height) {
        this.isJumping = false;
        this.y = 0.9 * canvas.height - this.height;
        this.speedY = 0;
      }
    }
  }

  function setup() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    context.imageSmoothingEnabled = false;
    player = new Player();
    ticks = 0;
    img.src = 'animation1.png';
    img1.src = 'animation2.png';
    currentCharacterImage = img;
    addEventListener("keydown", keyListener);
    document.body.addEventListener("keyup", keyListener);
  }

  function keyListener(evt) {
    var key_state = (evt.type == "keydown") ? true : false;

    switch (evt.keyCode) {
      case 37:
        player.isLeft = key_state;
        break;
      case 32:
        player.isUp = key_state;
        break;
      case 39:
        player.isRight = key_state;
        break;
    }
  }

  function draw() {
    player.update();
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
    if (ticks % 10 == 0) {
      if (currentCharacterImage == img) currentCharacterImage = img1;
      else currentCharacterImage = img;
    }
    context.drawImage(currentCharacterImage, player.x, player.y, player.width, player.height);
    ticks++;
    context.closePath();
  }

  var player;
  var ticks;
  var img = new Image();
  var img1 = new Image();
  var currentCharacterImage;
  setup();
  requestAnimationFrame(draw);
}(document.querySelector('canvas'), document.querySelector('canvas').getContext('2d')));
