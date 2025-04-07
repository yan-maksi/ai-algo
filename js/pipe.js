class Pipe {
    /**
     * @param {number} x - initial x position of the pipe
     */
    constructor(x) {
        this.x = x;
        // calculate a suitable height for the top pipe
        this.topHeight = random(80, CANVAS_HEIGHT - PIPE_GAP - 100);
        this.scored = false;
    }
    
    update() {
        this.x -= PIPE_SPEED;
    }
    
    show() {
        // calculate the appropriate height for the pipes based on the image aspect ratio
        const pipeImageAspectRatio = 800 / 53; // height/width
        const effectivePipeHeight = PIPE_WIDTH * pipeImageAspectRatio;
        
        // Draw top pipe (fliped him)
        push();
        translate(this.x + PIPE_WIDTH / 2, this.topHeight);
        scale(1, -1);
        image(pipeImg, -PIPE_WIDTH / 2, 0, PIPE_WIDTH, effectivePipeHeight);
        pop();
        
        // Draw bottom pipe
        image(pipeImg, this.x, this.topHeight + PIPE_GAP, PIPE_WIDTH, effectivePipeHeight);
    }
    
    /**
     * check if the pipe has moved off the left edge of the screen
     * @returns {boolean} true if the pipe is no longer visible
     */
    offscreen() {
        return this.x < -PIPE_WIDTH;
    }
}