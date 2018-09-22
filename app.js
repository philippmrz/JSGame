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
        this.speedY -= 30;
        this.isJumping = true;
       }

       if (this.isJumping){
         if (this.isLeft) this.speedX -= 1.25;
         if (this.isRight) this.speedX += 1.25;
       }

      if (this.isLeft) {
        this.speedX -= 1.5;
      }

      if (this.isRight) {
        this.speedX += 1.5;
      }

      this.speedY += 2;
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
    img.src = 'animation1-right.png';
    img1.src = 'animation2-right.png';
    img2.src = 'animation1-left.png';
    img3.src = 'animation2-left.png';
    img4.src = 'standing-right.png';
    img5.src = 'standing-left.png';
    currentCharacterImage = img;
    addEventListener("keydown", keyListener);
    addEventListener("keyup", keyListener);
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
    animatePlayer();
    context.drawImage(currentCharacterImage, player.x, player.y, player.width, player.height);
    ticks++;
    context.closePath();
  }
  function animatePlayer() {
    if (ticks % 9 == 0) {
      if (player.isRight) {
        if (currentCharacterImage == img) currentCharacterImage = img1;
        else currentCharacterImage = img;
      }
      else if (player.isLeft) {
        if (currentCharacterImage == img2) currentCharacterImage = img3;
        else currentCharacterImage = img2;
      }
      else if (!player.isLeft && !player.isRight) {
        if (currentCharacterImage == img || currentCharacterImage == img1) {
          currentCharacterImage = img4;
        }
        if (currentCharacterImage == img2 || currentCharacterImage == img3) {
          currentCharacterImage = img5;
        }
      }
    }
  }
  var player;
  var ticks;
  var img = new Image();
  var img1 = new Image();
  var img2 = new Image();
  var img3 = new Image();
  var img4 = new Image();
  var img5 = new Image();
  var currentCharacterImage;
  setup();
  requestAnimationFrame(draw);
}(document.querySelector('canvas'), document.querySelector('canvas').getContext('2d')));
