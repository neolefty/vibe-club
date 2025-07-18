const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let score = 0;
let lives = 3;
let gameOver = false;
let gameWon = false;
let highScore = localStorage.getItem('breakoutHighScore') ? parseInt(localStorage.getItem('breakoutHighScore')) : 0;
const ballTrail = [];

// Paddle
const paddle = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 20,
    width: 100,
    height: 10,
    color: '#0095DD',
    dx: 8
};

// Ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    radius: 10,
    speed: 4,
    dx: 4,
    dy: -4,
    color: '#0095DD'
};

// Bricks
const brickInfo = {
    rowCount: 5,
    columnCount: 9,
    width: 75,
    height: 20,
    padding: 10,
    offsetTop: 30,
    offsetLeft: 30
};

const brickColors = ['#A133FF', '#FF33A1', '#3357FF', '#33FF57', '#FF5733'];

const bricks = [];
for (let c = 0; c < brickInfo.columnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickInfo.rowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1, health: brickInfo.rowCount - r };
    }
}

// Event listeners
document.addEventListener('mousemove', mouseMoveHandler);

function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddle.x = relativeX - paddle.width / 2;
    }
}

function collisionDetection() {
    // Ball and brick collision
    for (let c = 0; c < brickInfo.columnCount; c++) {
        for (let r = 0; r < brickInfo.rowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (
                    ball.x > b.x &&
                    ball.x < b.x + brickInfo.width &&
                    ball.y > b.y &&
                    ball.y < b.y + brickInfo.height
                ) {
                    ball.dy = -ball.dy;
                    b.health--;
                    if (b.health === 0) {
                        b.status = 0;
                        score++;
                    }
                    
                    // Adjust ball speed
                    const newSpeed = 4 + (brickInfo.rowCount - r) * 0.5;
                    const currentSpeed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
                    ball.dx = (ball.dx / currentSpeed) * newSpeed;
                    ball.dy = (ball.dy / currentSpeed) * newSpeed;

                    if (score === brickInfo.rowCount * brickInfo.columnCount) {
                        gameWon = true;
                    }
                }
            }
        }
    }

    // Ball and wall collision
    if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
    }
    if (ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
    } else if (ball.y + ball.dy > canvas.height - ball.radius) {
        // Ball and paddle collision
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            let collidePoint = ball.x - (paddle.x + paddle.width / 2);
            collidePoint = collidePoint / (paddle.width / 2);
            const angle = (collidePoint * Math.PI) / 3;
            const currentSpeed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
            ball.dx = currentSpeed * Math.sin(angle);
            ball.dy = -currentSpeed * Math.cos(angle);
        } else {
            lives--;
            if (!lives) {
                gameOver = true;
            } else {
                ball.x = canvas.width / 2;
                ball.y = canvas.height - 30;
                ball.dx = 4;
                ball.dy = -4;
                paddle.x = (canvas.width - paddle.width) / 2;
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function drawBallTrail() {
    for (let i = 0; i < ballTrail.length; i++) {
        const trailPoint = ballTrail[i];
        const opacity = (i / ballTrail.length) * 0.8; // Fade out older points
        const radius = ball.radius * (i / ballTrail.length) * 0.8; // Shrink older points

        ctx.beginPath();
        ctx.arc(trailPoint.x, trailPoint.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 149, 221, ${opacity})`; // Use ball color with varying opacity
        ctx.fill();
        ctx.closePath();
    }
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = paddle.color;
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickInfo.columnCount; c++) {
        for (let r = 0; r < brickInfo.rowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickInfo.width + brickInfo.padding) + brickInfo.offsetLeft;
                const brickY = r * (brickInfo.height + brickInfo.padding) + brickInfo.offsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickInfo.width, brickInfo.height);
                ctx.fillStyle = brickColors[bricks[c][r].health - 1];
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText('Score: ' + score, 8, 20);

    const highScoreText = 'High Score: ' + highScore;
    const highScoreTextWidth = ctx.measureText(highScoreText).width;
    ctx.fillText(highScoreText, (canvas.width - highScoreTextWidth) / 2, 20);
}

function drawLives() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    const livesText = 'Lives: ' + lives;
    const livesTextWidth = ctx.measureText(livesText).width;
    ctx.fillText(livesText, canvas.width - livesTextWidth - 8, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBallTrail();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    ballTrail.push({ x: ball.x, y: ball.y });
    if (ballTrail.length > 15) {
        ballTrail.shift(); // Remove the oldest position
    }

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (gameOver || gameWon) {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('breakoutHighScore', highScore);
        }
        ctx.font = '48px Arial';
        ctx.fillStyle = '#0095DD';
        const message = gameOver ? 'GAME OVER' : 'YOU WIN!';
        ctx.fillText(message, canvas.width / 2 - (message.length * 12), canvas.height / 2 - 30);
        ctx.font = '24px Arial';
        ctx.fillText('Click to start a new game', canvas.width / 2 - 150, canvas.height / 2 + 20);
        return;
    }


    requestAnimationFrame(draw);
}

function restartGame() {
    score = 0;
    lives = 3;
    gameOver = false;
    gameWon = false;

    ball.x = canvas.width / 2;
    ball.y = canvas.height - 30;
    ball.dx = 4;
    ball.dy = -4;
    ball.speed = 4;

    paddle.x = canvas.width / 2 - 50;

    for (let c = 0; c < brickInfo.columnCount; c++) {
        for (let r = 0; r < brickInfo.rowCount; r++) {
            bricks[c][r].status = 1;
            bricks[c][r].health = brickInfo.rowCount - r;
        }
    }
    ballTrail.length = 0; // Clear the ball trail
    draw();
}

canvas.addEventListener('click', () => {
    if (gameOver || gameWon) {
        restartGame();
    }
});

draw();
