/**
 * Game module for the Flappy Bird game
 * Handles game mechanics, rendering, and interactions
 */

// ====== GAME CONSTANTS ======
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const BIRD_SIZE = { width: 32, height: 32 }; // Actual bird size: 32x32
const BIRD_X_POS = 150;
const GRAVITY = 0.6;
const JUMP_FORCE = -10;
const PIPE_WIDTH = 53; // Actual pipe width: 53px
const PIPE_GAP = 180; // Increased gap between pipes
const PIPE_SPAWN_INTERVAL = 120; // Frames between pipe spawns
const PIPE_SPEED = 3;
const GROUND_HEIGHT = 50;

// ====== AI CONSTANTS ======
const POPULATION_SIZE = 20;
const MUTATION_RATE = 0.3;
const ELITISM_PERCENT = 0.1;

// ====== GAME VARIABLES ======
let backgroundImg, birdImg, pipeImg;
let pipes = [];
let score = 0;
let bestScore = 0;
let isGameOver = false;
let nextPipeIndex = 0;

// ====== AI VARIABLES ======
let neat;
let generation = 1;
let birds = [];
let aiActive = true;
let manualBird = null;
let showAllBirds = true;

/**
 * Load game assets before the game starts
 */
function preload() {
    backgroundImg = loadImage("assets/images/background.png");
    birdImg = loadImage("assets/images/bird.png");
    pipeImg = loadImage("assets/images/pipe.png");
}

/**
 * Update and render all birds in AI mode
 */
function updateAIBirds() {
    // Update all birds
    for (let i = 0; i < birds.length; i++) {
        if (birds[i].alive) {
            birds[i].think();
            birds[i].update();
        }
    }
    
    // Find the best bird
    const { bird: bestBird, index: bestIndex } = findBestBird();
    
    // Draw birds based on display preference
    if (showAllBirds) {
        // Draw all birds
        for (let i = 0; i < birds.length; i++) {
            if (birds[i].alive) {
                birds[i].show(i === bestIndex);
            }
        }
    } else if (bestBird) {
        // Only draw the best bird
        bestBird.show(true);
    }
    
    // If all birds are dead, evolve
    if (areAllBirdsDead()) {
        evolvePopulation();
    }
    
    // Update stats display
    document.getElementById('stats').innerText = 
        `Generation: ${generation} | Population: ${birds.filter(b => b.alive).length} | ` +
        `Score: ${score} | Best Score: ${bestScore}`;
}

/**
 * Update and render manual bird in player mode
 */
function updateManualBird() {
    if (!isGameOver) {
        manualBird.update();
        manualBird.show();
        
        // Update stats display
        document.getElementById('stats').innerText = 
            `Manual Mode | Score: ${score} | Best Score: ${bestScore}`;
    } else {
        // Game over display
        fill(0, 0, 0, 150);
        rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        fill(255);
        textSize(32);
        textAlign(CENTER);
        text("GAME OVER", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        textSize(24);
        text(`Score: ${score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
        text("Press SPACE to restart", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 80);
        
        // Update stats display
        document.getElementById('stats').innerText = 
            `Manual Mode | Score: ${score} | Best Score: ${bestScore}`;
    }
}

/**
 * Update and render pipes
 */
function updatePipes() {
    // Process existing pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].update();
        pipes[i].show();
        
        // Remove pipes that are off screen
        if (pipes[i].offscreen()) {
            pipes.splice(i, 1);
            continue;  // Skip the rest for this pipe
        }
        
        // Check if pipe is passed and update score
        if (pipes[i].x + PIPE_WIDTH < BIRD_X_POS && !pipes[i].scored) {
            pipes[i].scored = true;
            score++;
        }
        
        // Check collisions
        if (aiActive) {
            for (let j = 0; j < birds.length; j++) {
                if (birds[j].alive && birds[j].checkCollision(pipes[i])) {
                    birds[j].die();
                }
            }
        } else if (manualBird.alive && manualBird.checkCollision(pipes[i])) {
            manualBird.die();
            isGameOver = true;
        }
    }
    
    // Generate new pipes with minimum spacing
    const minPipeSpacing = 250; // Minimum x-distance between pipes
    
    let shouldSpawnPipe = true;
    
    // Check if there are any pipes too close to the right edge
    for (let i = 0; i < pipes.length; i++) {
        if (pipes[i].x > CANVAS_WIDTH - minPipeSpacing) {
            shouldSpawnPipe = false;
            break;
        }
    }
    
    // Spawn new pipe if needed and enough time has passed
    if (shouldSpawnPipe && frameCount % PIPE_SPAWN_INTERVAL === 0) {
        pipes.push(new Pipe(CANVAS_WIDTH));
    }
}

/**
 * Reset the game state
 */
function resetGame() {
    pipes = [];
    score = 0;
    nextPipeIndex = 0;
    isGameOver = false;
}