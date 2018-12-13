(function(canvas, context) {
  class Player {
    constructor() {
      this.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
      this.width = 60;
      this.height = 90;
      this.x = 0.1 * canvas.width;
      this.oldX;
      this.y = 0.9 * canvas.height - this.height;
      this.oldY;
      this.speedX = 0;
      this.accX = 0.4;
      this.topSpeedX = 10;
      this.speedY = 0;
      this.isLeft = false;
      this.isRight = false;
      this.isUp = false;
      this.isJumping = false;
      this.currentImage = standingImages[0];
    }

    updateX() {
      this.oldX = this.x;
      if (this.isJumping) {
        if (this.isLeft && this.speedX > -this.topSpeedX) this.speedX -= this.accX;
        if (this.isRight && this.speedX < this.topSpeedX) this.speedX += this.accX;
      }

      if (this.isLeft && this.speedX > -this.topSpeedX) this.speedX -= this.accX;
      else if (this.isRight && this.speedX < this.topSpeedX) this.speedX += this.accX;

      if (!(this.isLeft || this.isRight)) this.speedX *= 0.9;

      this.x += this.speedX;

      if (this.x < 0) this.x = 0; //Left border
    }

    updateY() {
      this.oldY = this.y;
      if (this.isUp && !this.isJumping) {
        this.speedY -= 30;
        this.isJumping = true;
      }

      this.speedY += 2; //Gravity
      this.y += this.speedY;

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

    detectObjects() {
      if (leancup.x + leancup.width >= this.x && leancup.x <= this.x + this.width && leancup.y >= this.y && leancup.y <= this.y + this.height) {
        leancup.x = Math.floor(Math.random() * (canvas.width - leancup.width) + leancup.width / 2);
        leancupCounter.counter++;
      }
      if (player.x + player.width < solid.x || player.x > solid.x + solid.width || player.y + player.height < solid.y || player.y > solid.y + solid.height) {
      } else if (this.y + this.height >= solid.y && this.oldY + this.height < solid.y) {
        //top
        this.y = solid.y - this.height - 0.1;
        this.speedY = 0;
        this.isJumping = false;
      } else if (this.y <= solid.y + solid.height && this.oldY > solid.y + solid.height) {
        //bottom
        this.y = solid.y + solid.height + 0.1;
        this.speedY = 0;
      } else if (this.x + this.width >= solid.x && this.oldX + this.width < solid.x) {
        //left
        this.x = solid.x - this.width - 0.1;
        this.speedX = 0;
      } else if (this.x <= solid.x + solid.width && this.oldX > solid.x + solid.width) {
        //right
        this.x = solid.x + solid.width + 0.1;
        this.speedX = 0;
      }


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

  class LeancupCounter {
    constructor() {
      this.counter = 0;
      this.x = 0.05 * canvas.width;
      this.y = 0.05 * canvas.height;
      this.width = 100;
      this.height = 50;
    }

    draw() {
      context.beginPath();
      context.drawImage(leancupIMG, this.x + 15, this.y + 7, leancup.width * 0.8, leancup.height * 0.8);
      context.fillStyle = '#fff';
      context.font = "30px sans";
      context.fillText(this.counter, this.x + this.width - 40, this.y + this.height / 2 + 10);
      context.closePath();
    }
  }

  class Solid {
    constructor(x, y, width, height, color) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.color = color;
    }

    draw() {
      context.beginPath();
      context.fillstyle = this.color;
      context.rect(this.x, this.y, this.width, this.height);
      context.fill();
      context.closePath();
    }
  }

  function gameLoop() {
    requestAnimationFrame(gameLoop);
    player.updateX();
    player.updateY();
    player.detectObjects();
    leancup.update();
    if (ticks % 9 == 0) player.changeCurrentImage();
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    player.draw();
    leancup.draw();
    solid.draw();
    leancupCounter.draw();
  }

  function setup() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    context.imageSmoothingEnabled = false;

    player = new Player();
    leancup = new Leancup();
    leancupCounter = new LeancupCounter();
    solid = new Solid(canvas.width * 0.4, canvas.height * 0.5 - 60, 500, 60);
    walkRightImages[0].src = 'assets/animation1-right.png';
    walkRightImages[1].src = 'assets/animation2-right.png';
    walkLeftImages[0].src = 'assets/animation1-left.png';
    walkLeftImages[1].src = 'assets/animation2-left.png';
    standingImages[0].src = 'assets/standing-right.png';
    standingImages[1].src = 'assets/standing-left.png';
    leancupIMG.src = 'assets/leancup.png';
    bgIMG.src = 'assets/skyline.png';

    addEventListener("keydown", keyListener);
    addEventListener("keyup", keyListener);

    ticks = 0;

    requestAnimationFrame(gameLoop);

    //lOGS FOR DEBUG
    console.log('Canvas height:', canvas.height);
  }

  function drawBackground() {
    context.beginPath();
    context.fillStyle = '#000000';
    context.rect(0, 0.9 * canvas.height, canvas.width, 0.1 * canvas.height);
    context.fill();
    for (let x = 0; x < canvas.width; x += 200) context.drawImage(bgIMG, x, 0.9 * canvas.height - 252);
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
  var bgIMG = new Image();

  //Entrypoint
  setup();
}(document.querySelector('canvas'), document.querySelector('canvas').getContext('2d')));
