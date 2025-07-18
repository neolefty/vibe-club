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
    { x: 2 * TILE_SIZE + TILE_SIZE / 2, y: -TILE_SIZE / 2 }, // Start off-screen
    { x: 2 * TILE_SIZE + TILE_SIZE / 2, y: 1 * TILE_SIZE + TILE_SIZE / 2 },
    { x: 9 * TILE_SIZE + TILE_SIZE / 2, y: 1 * TILE_SIZE + TILE_SIZE / 2 },
    { x: 9 * TILE_SIZE + TILE_SIZE / 2, y: 4 * TILE_SIZE + TILE_SIZE / 2 },
    { x: 4 * TILE_SIZE + TILE_SIZE / 2, y: 4 * TILE_SIZE + TILE_SIZE / 2 },
    { x: 4 * TILE_SIZE + TILE_SIZE / 2, y: 6 * TILE_SIZE + TILE_SIZE / 2 },
    { x: 11 * TILE_SIZE + TILE_SIZE / 2, y: 6 * TILE_SIZE + TILE_SIZE / 2 },
    { x: 11 * TILE_SIZE + TILE_SIZE / 2, y: 8 * TILE_SIZE + TILE_SIZE / 2 }, // End off-screen
];


// Game state
let enemies = [];
let towers = [];
let projectiles = [];

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

class Tower {
    constructor(x, y) {
        this.x = x * TILE_SIZE + TILE_SIZE / 2;
        this.y = y * TILE_SIZE + TILE_SIZE / 2;
        this.radius = TILE_SIZE / 2 - 5;
        this.range = 150;
        this.fireRate = 60; // 1 shot per second
        this.fireCooldown = 0;
        this.color = 'blue';
    }

    update() {
        if (this.fireCooldown > 0) {
            this.fireCooldown--;
        }

        if (this.fireCooldown === 0) {
            const target = this.findTarget();
            if (target) {
                projectiles.push(new Projectile(this.x, this.y, target));
                this.fireCooldown = this.fireRate;
            }
        }
    }

    findTarget() {
        let closestEnemy = null;
        let closestDistance = this.range;

        enemies.forEach(enemy => {
            const dx = enemy.x - this.x;
            const dy = enemy.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestEnemy = enemy;
            }
        });
        return closestEnemy;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Projectile {
    constructor(x, y, target) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.speed = 5;
        this.damage = 25;
        this.radius = 3;
        this.color = 'yellow';
    }

    update() {
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.speed) {
            this.target.health -= this.damage;
            // Mark for deletion
            this.delete = true;
        } else {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
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
    towers.forEach(t => {
        t.update();
        t.draw();
    });

    projectiles.forEach(p => {
        p.update();
        p.draw();
    });

    enemies.forEach(e => {
        e.update();
        e.draw();
    });
    
    // Filter out dead enemies and projectiles that hit
    enemies = enemies.filter(e => e.health > 0);
    projectiles = projectiles.filter(p => !p.delete);


    requestAnimationFrame(gameLoop);
}

// Create an enemy
enemies.push(new Enemy());
towers.push(new Tower(3, 2));


// Start the game loop
requestAnimationFrame(gameLoop);