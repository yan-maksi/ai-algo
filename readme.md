https://github.com/user-attachments/assets/98e9b100-78d0-464e-afc9-098d92977903


# Flappy Bird AI – Powered by NEAT

This is a twist on the classic Flappy Bird game — but instead of you struggling to fly between pipes, an AI learns to do it on its own. The project uses the NEAT (NeuroEvolution of Augmenting Topologies) algorithm to evolve smarter birds generation after generation.

## 🧠 What’s Inside
- Full Flappy Bird game mechanics
- AI that teaches itself to play using NEAT
- Toggle between watching the whole population or just the top performer
- Play manually if you're feeling nostalgic (or competitive)
- Real-time stats: generation count, scores, and population size


## 🔧 Tech Stack
- HTML5 / CSS – Layout & styling
- JS – Game + AI logic
- p5.js – Rendering engine
- Neataptic.js – NEAT implementation


## Project Structure

```
flappy-bird-neat/
├── index.html     
├── styles.css           
├── js/
│   ├── main.js   
│   ├── game.js      
│   ├── bird.js         
│   ├── pipe.js          
│   └── ai.js            
├── assets/
│   ├── images/
│   │   ├── background.png  
│   │   ├── bird.png        
│   │   └── pipe.png        
└── README.md      
```


## How It Works

### 🧬 How the AI Learns
#### NEAT 101
NEAT evolves neural networks both in structure and weights. Here's how it's applied in this project:

1. Population: Each bird has its own tiny neural net.
2. Inputs:
   -  Bird's current height
   -  Distance to next pipe
   -  Top pipe position
   -  Bottom pipe position
3. Output: One value — should the bird flap?
4. Fitness: The longer a bird survives, the higher its score
4. Evolution:
   -  Best performers are kept (elitism)
   - New birds are born from crossover + mutation

## Usage
#### AI Mode (Default) and Manual Play
- Open the project in a browser
- Watch the flock try, fail, learn, and improve
- Gold-circled bird = best performer
- Want more chaos? Enable “Show All Birds”

## Customization
If you want to tweak behavior or difficulty, check out the constants in the code:
- `POPULATION_SIZE`: Number of birds in each generation
- `MUTATION_RATE`: How much random change occurs in new generations
- `PIPE_GAP`: The gap size between top and bottom pipes
- `GRAVITY`: The strength of gravity
- `JUMP_FORCE`: How powerful a jump is
