class Bird {
    /**
     * Create a new bird
     * @param {object} brain - NN for AI birds (null for manual control)
     * @param {array} color - RGB color for the bird [r, g, b]
     */
    constructor(brain, color) {
        this.y = CANVAS_HEIGHT / 2;
        this.velocity = 0;
        this.brain = brain;
        this.score = 0;
        this.fitness = 0;
        this.alive = true;
        this.color = color || [255, 255, 255]; // Default white, can be overridden
    }
    
    update() {
        if (!this.alive) return;
        
        this.velocity += GRAVITY;
        this.y += this.velocity;
        
        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
        
        if (this.y > CANVAS_HEIGHT - GROUND_HEIGHT - BIRD_SIZE.height) {
            this.die();
        }
        
        this.score++;
    }
    
    /**
     * Make the bird jump
     */
    jump() {
        if (!this.alive) return;
        this.velocity = JUMP_FORCE;
    }
    
    /**
     * Decision making process
     */
    think() {
        if (!this.alive || pipes.length === 0) return;
        
        // Find the next pipe that the bird hasn't passed yet
        let nextPipe = null;
        for (let i = 0; i < pipes.length; i++) {
            if (pipes[i].x + PIPE_WIDTH > BIRD_X_POS) {
                nextPipe = pipes[i];
                break;
            }
        }
        
        if (!nextPipe) return;
        
        // Calculate normalized inputs for the nn
        const inputs = [
            this.y / CANVAS_HEIGHT,                             // Bird's y position (normalized)
            nextPipe.x / CANVAS_WIDTH,                          // Distance to next pipe (normalized)
            nextPipe.topHeight / CANVAS_HEIGHT,                 // Top pipe height (normalized)
            (nextPipe.topHeight + PIPE_GAP) / CANVAS_HEIGHT     // Bottom pipe top position (normalized)
        ];
        
        // Get decision from neural network
        const output = this.brain.activate(inputs);
        
        // Jump if output is high enough
        if (output[0] > 0.5) {
            this.jump();
        }
    }
    
    /**
     * Render the bird on the canvas
     * @param {boolean} isBest - Whether this bird is the best performer in the current generation
     */
    show(isBest = false) {
        if (!this.alive) return;
        
        // If this is the best bird, highlight it
        if (isBest) {
            // Draw a halo or highlight around the best bird
            push();
            fill(255, 215, 0, 100); // Gold color with transparency
            ellipse(BIRD_X_POS + BIRD_SIZE.width/2, this.y + BIRD_SIZE.height/2, BIRD_SIZE.width*1.5, BIRD_SIZE.height*1.5);
            pop();
            
            // Draw the bird with normal coloring
            image(birdImg, BIRD_X_POS, this.y, BIRD_SIZE.width, BIRD_SIZE.height);
        } else {
            // Apply color tint to other birds
            push();
            tint(this.color[0], this.color[1], this.color[2], 180); // Semi-transparent
            image(birdImg, BIRD_X_POS, this.y, BIRD_SIZE.width, BIRD_SIZE.height);
            pop();
        }
    }
    
    /**
     * Eliminate the bird from the current generation
     */
    die() {
        this.alive = false;
    }
    
    /**
     * Check if the bird collides with a pipe
     * 
     * @param {Pipe} pipe - The pipe to check collision against
     * @returns {boolean} True if collision detected
     */
    checkCollision(pipe) {
        if (!this.alive) return false;
        
        // bird hitbox
        const birdBox = {
            left: BIRD_X_POS,
            right: BIRD_X_POS + BIRD_SIZE.width,
            top: this.y,
            bottom: this.y + BIRD_SIZE.height
        };
        
        // hitbox hitbox
        const topPipeBox = {
            left: pipe.x,
            right: pipe.x + PIPE_WIDTH,
            top: 0,
            bottom: pipe.topHeight
        };
        
        // hitbox bottom pipe 
        const bottomPipeBox = {
            left: pipe.x,
            right: pipe.x + PIPE_WIDTH,
            top: pipe.topHeight + PIPE_GAP,
            bottom: CANVAS_HEIGHT
        };
        
        // top pipe collision
        if (birdBox.right > topPipeBox.left && 
            birdBox.left < topPipeBox.right && 
            birdBox.bottom > topPipeBox.top && 
            birdBox.top < topPipeBox.bottom) {
            return true;
        }
        
        // bottom pipe collision
        if (birdBox.right > bottomPipeBox.left && 
            birdBox.left < bottomPipeBox.right && 
            birdBox.bottom > bottomPipeBox.top && 
            birdBox.top < bottomPipeBox.bottom) {
            return true;
        }
        
        return false;
    }
}