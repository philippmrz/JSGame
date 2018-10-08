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
      this.currentImage = standingImages[0];
    }

    update() {
      if (this.isUp && !this.isJumping) {
        this.speedY -= 30;
        this.isJumping = true;
      }

      if (this.isJumping) {
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
      this.speedX *= 0.87;

      if (this.y > 0.9 * canvas.height - this.height) {
        this.isJumping = false;
        this.y = 0.9 * canvas.height - this.height;
        this.speedY = 0;
      }
    }

    changeCurrentImage() {
      if (this.isRight) {
        //Add one to index to change currentImage
        let index = walkRightImages.indexOf(this.currentImage) + 1;
        if (index == walkRightImages.length) index = 0;
        this.currentImage = walkRightImages[index];
      } else if (this.isLeft) {
        let index = walkLeftImages.indexOf(this.currentImage) + 1;
        if (index == walkLeftImages.length) index = 0;
        this.currentImage = walkLeftImages[index];
      } else {
        if (walkRightImages.includes(this.currentImage)) {
          this.currentImage = standingImages[0];
        }
        if (walkLeftImages.includes(this.currentImage)) {
          this.currentImage = standingImages[1];
        }
      }
    }

    draw() {
      context.beginPath();
      context.drawImage(this.currentImage, this.x, this.y, this.width, this.height);
      context.closePath();
      ticks++;
    }
  }

  class Leancup {
    constructor() {
      this.width = 25;
      this.height = 44;
      this.deltaY = 20;
      this.x = canvas.width / 2;
      this.y = 0.9 * canvas.height - this.height - this.deltaY - 5;
      this.defaultY = this.y;
      this.speed = 1;
    }

    update() {
      if (this.y > this.defaultY + this.deltaY / 2 || this.y < this.defaultY - this.deltaY / 2) {
        this.speed *= -1;
      }
      this.y += this.speed;
    }

    draw() {
      context.beginPath();
      context.drawImage(leancupIMG, this.x, this.y, this.width, this.height);
      context.closePath();
    }
  }

  function gameLoop() {
    requestAnimationFrame(gameLoop);
    player.update();
    leancup.update();
    if (ticks % 9 == 0) player.changeCurrentImage();
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    player.draw();
    leancup.draw();
  }

  function setup() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    context.imageSmoothingEnabled = false;

    player = new Player();
    leancup = new Leancup();

    walkRightImages[0].src = 'assets/animation1-right.png';
    walkRightImages[1].src = 'assets/animation2-right.png';
    walkLeftImages[0].src = 'assets/animation1-left.png';
    walkLeftImages[1].src = 'assets/animation2-left.png';
    standingImages[0].src = 'assets/standing-right.png';
    standingImages[1].src = 'assets/standing-left.png';
    leancupIMG.src = 'assets/leancup.png'

    addEventListener("keydown", keyListener);
    addEventListener("keyup", keyListener);

    ticks = 0;

    requestAnimationFrame(gameLoop);

    //lOGS FOR DEBUG
    console.log('Leancup x:', leancup.x);
    console.log('Leancup y:', leancup.y);
    console.log('Canvas width:', canvas.width);
    console.log('Canvas height:', canvas.height);
  }

  function drawBackground() {
    context.beginPath();
    context.fillStyle = '#000000';
    context.rect(0, 0.9 * canvas.height, canvas.width, 0.1 * canvas.height);
    context.fill();
    context.closePath();
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

  var player;
  var leancup;
  var ticks;
  var walkRightImages = [new Image(), new Image()];
  var walkLeftImages = [new Image(), new Image()];
  var standingImages = [new Image(), new Image()];
  var leancupIMG = new Image();

  //Entrypoint
  setup();
}(document.querySelector('canvas'), document.querySelector('canvas').getContext('2d')));
