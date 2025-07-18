const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const TILE_SIZE = 50;
const MAP_WIDTH = 12;
const MAP_HEIGHT = 8;

// Set canvas dimensions
canvas.width = TILE_SIZE * MAP_WIDTH;
canvas.height = TILE_SIZE * MAP_HEIGHT;

// Map layout (0 = buildable, 1 = path)
const map = [
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0]
];

// Path waypoints (calculated from map)
const waypoints = [
    { x: 2 * TILE_SIZE + TILE_SIZE / 2, y: 0 * TILE_SIZE + TILE_SIZE / 2 },
    { x: 2 * TILE_SIZE + TILE_SIZE / 2, y: 1 * TILE_SIZE + TILE_SIZE / 2 },
    { x: 9 * TILE_SIZE + TILE_SIZE / 2, y: 1 * TILE_SIZE + TILE_SIZE / 2 },
    { x: 9 * TILE_SIZE + TILE_SIZE / 2, y: 4 * TILE_SIZE + TILE_SIZE / 2 },
    { x: 7 * TILE_SIZE + TILE_SIZE / 2, y: 4 * TILE_SIZE + TILE_SIZE / 2 },
    { x: 7 * TILE_SIZE + TILE_SIZE / 2, y: 7 * TILE_SIZE + TILE_SIZE / 2 },
    { x: 11 * TILE_SIZE + TILE_SIZE / 2, y: 7 * TILE_SIZE + TILE_SIZE / 2 },
];

// Game state
let gameObjects = [];

class Enemy {
    constructor() {
        this.waypointIndex = 0;
        this.x = waypoints[0].x;
        this.y = waypoints[0].y;
        this.speed = 2;
        this.health = 100;
        this.radius = 10;
        this.color = 'red';
    }

    update() {
        if (this.waypointIndex < waypoints.length) {
            const target = waypoints[this.waypointIndex];
            const dx = target.x - this.x;
            const dy = target.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.speed) {
                this.waypointIndex++;
            } else {
                this.x += (dx / distance) * this.speed;
                this.y += (dy / distance) * this.speed;
            }
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawMap() {
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            if (map[y][x] === 1) {
                ctx.fillStyle = '#555'; // Path color
            } else {
                ctx.fillStyle = '#333'; // Buildable area color
            }
            ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }
}

function gameLoop() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the map
    drawMap();

    // Update and draw all game objects
    gameObjects.forEach(obj => {
        obj.update();
        obj.draw();
    });

    requestAnimationFrame(gameLoop);
}

// Create an enemy
gameObjects.push(new Enemy());

// Start the game loop
requestAnimationFrame(gameLoop);