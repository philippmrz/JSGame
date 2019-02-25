(function(canvas, context) {
  class Player {
    constructor() {
      this.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
      this.width = 60;
      this.height = 90;
      this.x = 0.1 * canvas.width;
      this.oldX = this.x;
      this.y = 0.9 * canvas.height - this.height;
      this.oldY = this.y;
      this.speedX = 0;
      this.accX = 0.4;
      this.topSpeedX = 10;
      this.topSpeedXDuck = 5;
      this.speedY = 0;
      this.isLeft = false;
      this.isRight = false;
      this.isUp = false;
      this.isDown = false;
      this.facingLeft = false;
      this.facingRight = true;
      this.isDucking = false;
      this.isJumping = false;
      this.currentImage = imgsRight['stand'];
	    this.walk = false;
    }

    updateX() {
      this.oldX = this.x;
      if (this.isJumping) {
        if (this.isLeft && this.speedX > -this.topSpeedX) this.speedX -= this.accX;
        if (this.isRight && this.speedX < this.topSpeedX) this.speedX += this.accX;
      }


      if (this.isDucking) {
        if (Math.abs(this.speedX) > this.topSpeedXDuck) this.speedX *= 0.9;
        if (this.isLeft && this.speedX > -this.topSpeedXDuck) this.speedX -= this.accX;
        else if (this.isRight && this.speedX < this.topSpeedXDuck) this.speedX += this.accX;
      } else {
        if (Math.abs(this.speedX) > this.topSpeedX) this.speedX *= 0.9;
        if (this.isLeft && this.speedX > -this.topSpeedX) this.speedX -= this.accX;
        else if (this.isRight && this.speedX < this.topSpeedX) this.speedX += this.accX;
      }

      if (!(this.isLeft || this.isRight)) this.speedX *= 0.9;

      if (Math.abs(this.speedX) < 0.1) this.speedX = 0;

      this.x += this.speedX;

      if (this.x < 0) {
        this.x = 0; //Left border
        this.speedX = 0;
      }

      if (this.x + this.width > canvas.width) {
        this.x = canvas.width - this.width;
        this.speedX = 0;
      }

    }

    updateY() {
      this.oldY = this.y;
      if (this.isUp && !this.isJumping) {
        this.speedY -= 30;
        this.isJumping = true;
      }

      this.speedY += 2; //Gravity
      this.y += this.speedY;

      if (this.y >canvas.height - this.height - 50) {
        this.isJumping = false;
        this.y = canvas.height - this.height - 50;
        this.speedY = 0;
      }
    }

    updateStates() {
      if (this.isDown && !this.isJumping) {
        this.isDucking = true;
      } else {
        this.isDucking = false;
      }

      if (this.isLeft && !this.isRight) {
        this.facingLeft = true;
        this.facingRight = false;
      }

      if (!this.isLeft && this.isRight) {
        this.facingLeft = false;
        this.facingRight = true;
      }

    }

    changeCurrentImage() {
      if (this.facingLeft) {
        if (this.isJumping) {
          this.currentImage = imgsLeft['jump'];
        } else if (this.isDucking) {
          if (this.isLeft) {
            if (this.walk) {
              this.currentImage = imgsLeft['sneak'];
            } else {
              this.currentImage = imgsLeft['duck'];
            }
            this.walk = !this.walk;
          } else {
            this.currentImage = imgsLeft['duck'];
          }
        } else {
          if (this.isLeft) {
            if (this.walk) {
              this.currentImage = imgsLeft['walk'];
            } else {
              this.currentImage = imgsLeft['stand'];
            }
            this.walk = !this.walk;
          } else {
            this.currentImage = imgsLeft['stand'];
          }
        }
      } else if (this.facingRight) {
        if (this.isJumping) {
          this.currentImage = imgsRight['jump'];
        } else if (this.isDucking) {
          if (this.isRight) {
            if (this.walk) {
              this.currentImage = imgsRight['sneak'];
            } else {
              this.currentImage = imgsRight['duck'];
            }
            this.walk = !this.walk;
          } else {
            this.currentImage = imgsRight['duck'];
          }
        } else {
          if (this.isRight) {
            if (this.walk) {
              this.currentImage = imgsRight['walk'];
            } else {
              this.currentImage = imgsRight['stand'];
            }
            this.walk = !this.walk;
          } else {
            this.currentImage = imgsRight['stand'];
          }
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

      solids.forEach(function(solid) {
        getCollision(solid, player)
      });
    }
  }

  class Leancup {
    constructor() {
      this.width = 25;
      this.height = 44;
      this.deltaY = 20;
      this.x = canvas.width / 2;
      this.y = canvas.height - 50 - this.height - this.deltaY - 5;
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
      context.font = '30px sans';
      context.fillText(this.counter, this.x + this.width - 40, this.y + this.height / 2 + 10);
      context.closePath();
    }
  }

  class Solid {
    constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }

    draw() {
      context.beginPath();
      context.drawImage(concrete, this.x, this.y, this.width, this.height);
      context.closePath();
    }
  }

  function gameLoop() {
    requestAnimationFrame(gameLoop);
    player.updateX();
    player.updateY();
    player.updateStates();
    player.detectObjects();
    leancup.update();
    if (ticks % 9 == 0) player.changeCurrentImage();
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    player.draw();
    leancup.draw();
    solids.forEach(function(solid) {
      solid.draw();
    });
    leancupCounter.draw();
  }

  function setup() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    context.imageSmoothingEnabled = false;

    player = new Player();
    leancup = new Leancup();
    leancupCounter = new LeancupCounter();
    solids = [
      new Solid(220, canvas.height - 250, 200, 60),
      new Solid(500, canvas.height - 300, 200, 60),
      new Solid(800, canvas.height - 400, 200, 60),
      new Solid(0, canvas.height- 50, canvas.width, 50)
    ];

    imgsLeft['stand'].src = 'assets/standL.png';
    imgsLeft['walk'].src = 'assets/walkL.png';
    imgsLeft['jump'].src = 'assets/jumpL.png';
    imgsLeft['duck'].src = 'assets/duckStandL.png';
    imgsLeft['sneak'].src = 'assets/duckWalkL.png';

    imgsRight['stand'].src = 'assets/standR.png';
    imgsRight['walk'].src = 'assets/walkR.png';
    imgsRight['jump'].src = 'assets/jumpR.png';
    imgsRight['duck'].src = 'assets/duckStandR.png';
    imgsRight['sneak'].src = 'assets/duckWalkR.png';

    concrete.src = 'assets/concrete.jpg';
    leancupIMG.src = 'assets/leancup.png';
    bgIMG.src = 'assets/skyline.png';

    addEventListener('keydown', keyListener);
    addEventListener('keyup', keyListener);

    ticks = 0;

    requestAnimationFrame(gameLoop);

    //lOGS FOR DEBUG
    console.log('Canvas height:', canvas.height);
  }

  function getCollision(solid, obj) {
    if (!(obj.x + obj.width < solid.x || obj.x > solid.x + solid.width || obj.y + obj.height < solid.y || obj.y > solid.y + solid.height)) {
      if (obj.y + obj.height >= solid.y && obj.oldY + obj.height < solid.y) {
        //top
        obj.y = solid.y - obj.height - 0.1;
        obj.speedY = 0;
        obj.isJumping = false;
      } else if (obj.y <= solid.y + solid.height && obj.oldY > solid.y + solid.height) {
        //bottom
        obj.y = solid.y + solid.height + 0.1;
        obj.speedY = 0;
      } else if (obj.x + obj.width >= solid.x && obj.oldX + obj.width < solid.x) {
        //left
        obj.x = solid.x - obj.width - 0.1;
        obj.speedX = 0;
      } else if (obj.x <= solid.x + solid.width && obj.oldX > solid.x + solid.width) {
        //right
        obj.x = solid.x + solid.width + 0.1;
        obj.speedX = 0;
      }
    }
  }

  function drawBackground() {
    context.beginPath();
    context.fillStyle = '#000000';
    context.rect(0, canvas.height - 50, canvas.width, 0.1 * canvas.height);
    context.fill();
    for (let x = 0; x < canvas.width; x += 200) context.drawImage(bgIMG, x, canvas.height - 252 -50);
    context.closePath();
  }

  function keyListener(evt) {
    var key_state = (evt.type == 'keydown') ? true : false;

    switch (evt.keyCode) {
      case 37:
        player.isLeft = key_state;
        break;
      case 39:
        player.isRight = key_state;
        break;
      case 32:
        player.isUp = key_state;
        break;
      case 40:
        player.isDown = key_state;
        break;
    }
  }

  var player;
  var leancup;
  var ticks;
  //assign named keys to images
  var imgsLeft = {
    'stand' : new Image(),
    'walk' : new Image(),
    'jump' : new Image(),
    'duck' : new Image(),
    'sneak' : new Image()
  }
  var imgsRight = {
    'stand' : new Image(),
    'walk' : new Image(),
    'jump' : new Image(),
    'duck' : new Image(),
    'sneak' : new Image()
  }
  var leancupIMG = new Image();
  var bgIMG = new Image();
  var concrete = new Image();
  var solids;
  const LEFT = 0;
  const RIGHT = 1;
  const TOPPOM = 2;
  const BOTTOM = 3;

  //Entrypoint
  setup();
}(document.querySelector('canvas'), document.querySelector('canvas').getContext('2d')));
