const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');

// Game State Flag
let gameOver = false;
let victory = false;

// Array to Hold Enemies
let enemies = [];
let score = 0;

// Load Images
const rocketImg = new Image();
rocketImg.src = 'images/rocket.png';

const enemyImg = new Image();
enemyImg.src = 'images/enemy.png';

const bulletImg = new Image();
bulletImg.src = 'images/bullet.png';

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Rocket Properties
let rocket = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    width: 100,
    height: 100,
    color: 'white',
    speed: 5,
    movingLeft: false,
    movingRight: false,
    bullets: []
};

// Start Button Event Listener
startButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    canvas.style.display = 'block';
    startGame();
});

// Event Listeners for Rocket Movement
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') rocket.movingLeft = true;
    if (e.key === 'ArrowRight') rocket.movingRight = true;
    if (e.key === ' ' || e.key === 'Spacebar') fireBullet();
    if (e.key === 'r' || e.key === 'R') document.location.reload();
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') rocket.movingLeft = false;
    if (e.key === 'ArrowRight') rocket.movingRight = false;
});

// Initialize Game
function startGame() {
    gameOver = false;
    victory = false;
    score = 0;
    rocket.bullets = [];
    enemies = [];
    spawnEnemies();
    gameLoop();
}

// Function to Draw the Rocket
function drawRocket() {
    ctx.drawImage(rocketImg, rocket.x, rocket.y, rocket.width, rocket.height);
}

// Function to Move the Rocket
function moveRocket() {
    if (rocket.movingLeft && rocket.x > 0) rocket.x -= rocket.speed;
    if (rocket.movingRight && rocket.x + rocket.width < canvas.width) rocket.x += rocket.speed;
}

// Function to Fire Bullets
function fireBullet() {
    const bulletWidth = 30; // Increased bullet width
    const bulletHeight = 30; // Increased bullet height

    rocket.bullets.push({
        x: rocket.x + rocket.width / 2 - bulletWidth / 2,
        y: rocket.y,
        width: bulletWidth,
        height: bulletHeight,
        color: 'red',
        speed: 3
    });
}

// Function to Draw and Move Bullets
function drawBullets() {
    rocket.bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        ctx.drawImage(bulletImg, bullet.x, bullet.y, bullet.width, bullet.height);

        // Remove bullet if it goes off-screen
        if (bullet.y < 0) rocket.bullets.splice(index, 1);
    });
}

// Function to Spawn Enemies
function spawnEnemies() {
    const rows = 5;
    const cols = 8;
    const enemyWidth = 50;
    const enemyHeight = 50;
    const padding = 20;
    const totalWidth = cols * (enemyWidth + padding) - padding;

    // Calculate the starting x position to center the enemies
    const offsetLeft = (canvas.width - totalWidth) / 2;
    const offsetTop = 50;

    enemies = []; // Reset enemies array
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            enemies.push({
                x: col * (enemyWidth + padding) + offsetLeft,
                y: row * (enemyHeight + padding) + offsetTop,
                width: enemyWidth,
                height: enemyHeight,
                color: 'green'
            });
        }
    }
}

// Function to Draw Enemies
function drawEnemies() {
    enemies.forEach((enemy) => {
        ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

// Function to Move Enemies (Updated)
function moveEnemies() {
    const enemySpeed = 0.07;
    enemies.forEach((enemy) => {
        enemy.y += enemySpeed;
        // Check for Game Over if Enemy Reaches Bottom
        if (enemy.y + enemy.height >= canvas.height && !victory) {
            gameOver = true;
        }
    });
}

// Function to Handle Collisions
function checkCollisions() {
    rocket.bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                // Collision Detected!
                rocket.bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
                score += 10;
            }
        });
    });
}

// Function to Draw the Score
function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

// Function to Display Game Over Message
function drawGameOver() {
    ctx.fillStyle = 'red';
    ctx.font = '50px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
    ctx.font = '30px Arial';
    ctx.fillText('Final Score: ' + score, canvas.width / 2, canvas.height / 2 + 50);
    ctx.fillText('Press R to Restart', canvas.width / 2, canvas.height / 2 + 100);
}

// Function to Display Victory Message
function drawVictory() {
    ctx.fillStyle = 'yellow';
    ctx.font = '50px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('You Win!', canvas.width / 2, canvas.height / 2);
    ctx.font = '30px Arial';
    ctx.fillText('Final Score: ' + score, canvas.width / 2, canvas.height / 2 + 50);
    ctx.fillText('Press R to Restart', canvas.width / 2, canvas.height / 2 + 100);
}

// Function to Check for Victory
function checkVictory() {
    if (enemies.length === 0 && !gameOver) {
        victory = true;
    }
}

// Main Game Loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameOver && !victory) {
        drawRocket();
        moveRocket();

        drawBullets();
        drawEnemies();
        moveEnemies();

        checkCollisions();
        drawScore();
        checkVictory(); // Check if all enemies are destroyed

        requestAnimationFrame(gameLoop);
    } else if (gameOver) {
        drawGameOver();
    } else if (victory) {
        drawVictory();
    }
}

// Start the Game with Enemies Spawned
spawnEnemies();
gameLoop();
