var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var ballRadius = 8;
var x = canvas.width/2;
var y = canvas.height-30;
var dx = -4;
var dy = -4;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 8;
var brickColumnCount = 5;
var brickWidth = 80;
var brickHeight = 20;
var brickPadding = 2;
var brickOffsetTop = 10;
var brickOffsetLeft = 32;
var score = 0;
var lives = 3;
var paused = false;
var memoryX = dx;
var memoryY = dy;

var bricks = [];
for(c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    } else if(e.keyCode == 37) {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    } else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

function collisionDetection() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                            document.location.reload();
                    }
                }
            }
        }
    }
}

function togglePause() {
    if (paused === false) {
        paused = true;
    } else if (paused === true) {
       paused = false;
    }
}

window.addEventListener('keydown', function (e) {
var key = e.keyCode;
if (key === 80) { // P
    togglePause();
    if (paused === true) {
        dx = 0;
        dy = 0;
    } else if (paused === false) {
        dx = memoryX;
        dy = memoryY;
    }
}
});



function drawBackground() {
    ctx.beginPath();
    ctx.fillStyle = "rgba(55, 55, 55, .5)";
    ctx.moveTo(0, 440);
    ctx.lineTo(720, 0);
    ctx.lineTo(0, 0);
    ctx.fill();
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = '#'+(Math.random()*0xFFFFFF<<0).toString(16);//'rgb(' + Math.floor(255 - 150 * dx) + ',' + Math.floor(255 - 150 * dy) + ',0)';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-(paddleHeight+2), paddleWidth, paddleHeight);
    ctx.fillStyle = 'darkblue';
    ctx.fill();
    ctx.closePath();
}
function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = 'orange';//'#'+(Math.random()*0xFFFFFF<<0).toString(16);
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.font = "42px Arial";
    ctx.fillStyle = "darkblue";
    ctx.fillText(score, 350, 220);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "darkblue";
    ctx.fillText("Lives: "+lives, canvas.width-65, canvas.height-10);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    } else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX-2 && x < paddleX + paddleWidth+2) {
        dy = -dy;
        } else {
            lives--;
            if(lives == 0) {
                document.location.reload();
            } else {
                x = canvas.width/2;
                y = canvas.height-10;
                dx = 4;
                dy = -4;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }

    if  (rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 8;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 8;
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

draw();
