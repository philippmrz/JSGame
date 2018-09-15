var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');
var x = canvas.width / 2;
var y = canvas.height / 2;
var speedX = 2;
var speedY = 2;
var rectWidth = 100;
var rectHeight = 150;
const PLAYERCOLOR = '#' + Math.floor(Math.random() * 16777215).toString(16);
(function (){
  setup();
  requestAnimationFrame(draw);


function setup() {
  document.addEventListener('keydown', handleKeysPressed);
  document.addEventListener('keyup', handleKeysUnpressed);
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  context.lineWidth = 6;
  canvas.addEventListener('click',function(){
    context.clearRect(0, 0, canvas.width, canvas.height);
  });
}
  switch (evt.key) {
    case 'ArrowLeft':
      speedX = 1;
      speedY = 1;
      break;

    case 'ArrowRight':
      speedX = 1;
      speedY = 1;
      break;

    case 'ArrowUp':
      speedX = 1;
      speedY = 1;
      break;

    case 'ArrowDown':
      speedX = 1;
      speedY = 1;
      break;
  }
}
function handleKeysPressed(evt) {
  if(x >= canvas.width - rectWidth){
    x = canvas.width - rectWidth;
    speedX = - 0.7 * speedX;
  }
  if(x <= 0) {
    x = 0;
    speedX = -0.7 * speedX;
  }
  if(y >= canvas.height - rectHeight) {
    y = canvas.height - rectHeight;
    speedY = - 0.7 * speedY;
  }
  if (y <= 0) {
    y = 0;
    speedY = - 0.7 * speedY;
  }
switch (evt.key) {
  case 'ArrowLeft':
    x = x - speedX;
    speedX++;
    break;

  case 'ArrowRight':
    x = x + speedX;
    speedX++;
    console.log('speedX:', speedX);
    break;

  case 'ArrowUp':
    y = y - speedY;
    speedY++;
    break;

  case 'ArrowDown':
    y = y + speedY;
    speedY++;
    break;
}
}

function draw(){

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.beginPath()
  context.fillStyle = '#000000';
  context.rect(x, y, rectWidth, rectHeight);
  context.stroke()
  context.beginPath()
  context.fillStyle = PLAYERCOLOR;
  context.rect(x, y, rectWidth, rectHeight);
  context.fill();
  requestAnimationFrame(draw);
}

}());
