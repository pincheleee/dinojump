const dino = document.getElementById('dino');
const gameContainer = document.querySelector('.game-container');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('high-score');
const gameOverDisplay = document.getElementById('game-over');

// Game state
let isJumping = false;
let isGameOver = false;
let score = 0;
let highScore = 0;
let animationSpeed = 3;
let gameInterval;
let obstacleInterval;
let cloudInterval;
let scoreInterval;

// Jump physics
let position = 0;
let gravity = 0.9;

// Load high score from local storage
if (localStorage.getItem('highScore')) {
    highScore = parseInt(localStorage.getItem('highScore'));
    highScoreDisplay.textContent = `HI: ${highScore}`;
}

// Jump function
function jump() {
    if (isJumping) return;
    isJumping = true;
    
    let upTime = 0;
    let jumpHeight = 15;
    let jumpCount = 0;
    
    const jumpInterval = setInterval(() => {
        // Jumping up
        if (jumpCount < 15) {
            position += jumpHeight;
            jumpHeight -= 1;
            dino.style.bottom = position + 'px';
            jumpCount++;
        }
        // Coming down
        else {
            position -= gravity * upTime;
            dino.style.bottom = position + 'px';
            upTime++;
            
            // Landing
            if (position <= 0) {
                clearInterval(jumpInterval);
                position = 0;
                dino.style.bottom = '0';
                isJumping = false;
                jumpCount = 0;
                upTime = 0;
            }
        }
    }, 20);
}

// Generate obstacle (cactus or bird)
function generateObstacle() {
    // Don't generate if game over
    if (isGameOver) return;
    
    // Randomly decide if it's a cactus or bird
    const isBird = Math.random() > 0.7 && score > 500;
    
    // Create obstacle element
    const obstacle = document.createElement('div');
    obstacle.classList.add(isBird ? 'bird' : 'cactus');
    obstacle.style.left = '600px';
    gameContainer.appendChild(obstacle);
    
    // Move obstacle
    let obstaclePosition = 600;
    
    const moveObstacle = setInterval(() => {
        if (obstaclePosition < -50) {
            clearInterval(moveObstacle);
            gameContainer.removeChild(obstacle);
        } else if (
            obstaclePosition > 0 && 
            obstaclePosition < 60 && 
            position < (isBird ? 90 : 40)
        ) {
            // Collision detection
            clearInterval(moveObstacle);
            gameOver();
        } else {
            obstaclePosition -= animationSpeed;
            obstacle.style.left = obstaclePosition + 'px';
        }
    }, 20);
}

// Generate clouds
function generateCloud() {
    if (isGameOver) return;
    
    const cloud = document.createElement('div');
    cloud.classList.add('cloud');
    cloud.style.left = '600px';
    
    // Random height for the cloud
    const randomHeight = Math.floor(Math.random() * 50) + 30;
    cloud.style.top = randomHeight + 'px';
    
    gameContainer.appendChild(cloud);
    
    let cloudPosition = 600;
    
    const moveCloud = setInterval(() => {
        if (cloudPosition < -50) {
            clearInterval(moveCloud);
            gameContainer.removeChild(cloud);
        } else {
            cloudPosition -= 1; // Clouds move slower than obstacles
            cloud.style.left = cloudPosition + 'px';
        }
    }, 20);
}

// Game over function
function gameOver() {
    isGameOver = true;
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);
    clearInterval(cloudInterval);
    clearInterval(scoreInterval);
    
    // Show game over message
    gameOverDisplay.classList.remove('hidden');
    
    // Update high score if needed
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreDisplay.textContent = `HI: ${highScore}`;
    }
    
    // Remove all obstacles
    document.querySelectorAll('.cactus, .bird').forEach(obstacle => {
        gameContainer.removeChild(obstacle);
    });
}

// Start game function
function startGame() {
    isGameOver = false;
    score = 0;
    position = 0;
    animationSpeed = 3;
    
    // Clear any existing obstacles
    document.querySelectorAll('.cactus, .bird, .cloud').forEach(element => {
        gameContainer.removeChild(element);
    });
    
    // Reset displays
    scoreDisplay.textContent = '0';
    gameOverDisplay.classList.add('hidden');
    
    // Generate obstacles at random intervals
    obstacleInterval = setInterval(() => {
        // Increase the frequency as score increases
        const randomTime = Math.floor(Math.random() * (2000 - score/100)) + 1000;
        setTimeout(generateObstacle, randomTime);
    }, 2000);
    
    // Generate clouds at random intervals
    cloudInterval = setInterval(() => {
        const randomTime = Math.floor(Math.random() * 3000) + 2000;
        setTimeout(generateCloud, randomTime);
    }, 3000);
    
    // Increase score
    scoreInterval = setInterval(() => {
        score += 10;
        scoreDisplay.textContent = score;
        
        // Increase animation speed every 500 points
        if (score % 500 === 0 && animationSpeed < 8) {
            animationSpeed += 0.5;
        }
    }, 100);
}

// Event listeners
document.addEventListener('keydown', (event) => {
    if ((event.code === 'Space' || event.key === 'ArrowUp' || event.code === 'KeyW') && !isJumping) {
        jump();
    }
    
    // Restart on Enter when game over
    if ((event.code === 'Enter' || event.code === 'Space') && isGameOver) {
        startGame();
    }
});

// Touch support for mobile
document.addEventListener('touchstart', () => {
    if (!isJumping) {
        jump();
    }
    
    if (isGameOver) {
        startGame();
    }
});

// Start the game
startGame(); 