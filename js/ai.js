/**
 * AI module for the Flappy Bird game
 * Handles the NEAT algorithm implementation and evolution of neural networks
 */

function setupAI() {
    // Configure NEAT
    neat = new neataptic.Neat(
        4,                  // input neurons: bird y, pipe x, pipe top height, pipe bottom y
        1,                  // output neurons: jump or not
        null,               // fitness function (assigned later)
        {
            mutation: [
                neataptic.methods.mutation.ADD_NODE,
                neataptic.methods.mutation.SUB_NODE,
                neataptic.methods.mutation.ADD_CONN,
                neataptic.methods.mutation.SUB_CONN,
                neataptic.methods.mutation.MOD_WEIGHT,
                neataptic.methods.mutation.MOD_BIAS,
                neataptic.methods.mutation.MOD_ACTIVATION
            ],
            popsize: POPULATION_SIZE,
            mutationRate: MUTATION_RATE,
            elitism: Math.floor(POPULATION_SIZE * ELITISM_PERCENT)
        }
    );
    
    // Create initial population
    createBirdPopulation();
}

/**
 * Generate a random RGB color for bird visualization
 * @returns {array} RGB color array [r, g, b]
 */
function getRandomColor() {
    return [
        Math.floor(random(100, 255)), // R
        Math.floor(random(100, 255)), // G
        Math.floor(random(100, 255))  // B
    ];
}

/**
 * Create a population of birds, each with its own neural network and color
 */
function createBirdPopulation() {
    birds = [];
    for (let i = 0; i < POPULATION_SIZE; i++) {
        const brain = neat.population[i];
        birds.push(new Bird(brain, getRandomColor()));
    }
}

/**
 * Evolve the population to create a new generation
 * Called when all birds in current generation have died
 */
function evolvePopulation() {
    // calculate fitness for each bird
    for (let i = 0; i < birds.length; i++) {
        neat.population[i].score = birds[i].score;
    }
    
    // sort by score
    neat.sort();
    
    // get best score
    const currentBest = neat.getFittest().score;
    if (currentBest > bestScore) {
        bestScore = currentBest;
    }
    
    neat.evolve();
    generation++;
    
    resetGame();
    createBirdPopulation();
}

/**
 * Find the best performing bird in the current generation
 * @returns {object} Object containing the best bird and its index
 */
function findBestBird() {
    let bestBird = null;
    let bestScore = -1;
    let bestIndex = -1;
    
    for (let i = 0; i < birds.length; i++) {
        if (birds[i].alive && birds[i].score > bestScore) {
            bestBird = birds[i];
            bestScore = birds[i].score;
            bestIndex = i;
        }
    }
    
    return { bird: bestBird, index: bestIndex };
}

/**
 * Check if all birds have died in the current generation
 * @returns {boolean} True if all birds are dead
 */
function areAllBirdsDead() {
    return birds.every(bird => !bird.alive);
}