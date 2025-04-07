/**
 * Main module for the Flappy Bird game
 * Initializes the game, sets up event handlers, and runs the main game loop
 */

/**
 * Setup function - Initializes the game
 * Called once when the program starts
 */
function setup() {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    setupAI();
    
    // Create manual bird for human play
    manualBird = new Bird(null);
    resetGame();
    setupUIControls();
}

/**
 * Set up event listeners for UI controls
 */
function setupUIControls() {

    document.getElementById('toggleAI').addEventListener('click', () => {
        aiActive = !aiActive;
        resetGame();
        if (!aiActive) {
            manualBird = new Bird(null);
            isGameOver = false;
        }
    });
    
    // Reset game
    document.getElementById('resetGame').addEventListener('click', () => {
        resetGame();
        if (!aiActive) {
            manualBird = new Bird(null);
            isGameOver = false;
        }
    });
    
    document.getElementById('showAllBirds').addEventListener('change', (e) => {
        showAllBirds = e.target.checked;
    });
}

/**
 * Draw function - Main game loop
 * Called continuously for each frame
 */
function draw() {
    image(backgroundImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    updatePipes();
    
    if (aiActive) {
        updateAIBirds();
    } else {
        updateManualBird();
    }
    
    fill(139, 69, 19);
    rect(0, CANVAS_HEIGHT - GROUND_HEIGHT, CANVAS_WIDTH, GROUND_HEIGHT);
    
    fill(255);
    textSize(24);
    textAlign(LEFT);
    text(`Score: ${score}`, 10, 30);
}

/**
 * Handle keyboard input
 * Called when a key is pressed
 */
function keyPressed() {
    if (key === ' ') {
        if (!aiActive) {
            if (isGameOver) {
                resetGame();
                manualBird = new Bird(null);
                isGameOver = false;
            } else {
                manualBird.jump();
            }
        }
        return false; // prevent scrolling with spacebar
    }
}