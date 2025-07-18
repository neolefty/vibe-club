const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const buildMeterProgress = document.getElementById('build-meter-progress');

// Game constants
const TILE_SIZE = 50;
const MAP_WIDTH = 12;
const MAP_HEIGHT = 8;
const TOWER_COST = 100;

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

// Path waypoints
const waypoints = [
    { x: 2 * TILE_SIZE + TILE_SIZE / 2, y: -TILE_SIZE / 2 },
    { x: 2 * TILE_SIZE + TILE_SIZE / 2, y: 1 * TILE_SIZE + TILE_SIZE / 2 },
    { x: 9 * TILE_SIZE + TILE_SIZE / 2, y: 1 * TILE_SIZE + TILE_SIZE / 2 },
    { x: 9 * TILE_SIZE + TILE_SIZE / 2, y: 4 * TILE_SIZE + TILE_SIZE / 2 },
    { x: 4 * TILE_SIZE + TILE_SIZE / 2, y: 4 * TILE_SIZE + TILE_SIZE / 2 },
    { x: 4 * TILE_SIZE + TILE_SIZE / 2, y: 6 * TILE_SIZE + TILE_SIZE / 2 },
    { x: 11 * TILE_SIZE + TILE_SIZE / 2, y: 6 * TILE_SIZE + TILE_SIZE / 2 },
    { x: 11 * TILE_SIZE + TILE_SIZE / 2, y: 8 * TILE_SIZE + TILE_SIZE / 2 },
];

// Game state
let enemies = [];
let towers = [];
let projectiles = [];
let buildMeter = 0;
let placementMode = false;
let frameCounter = 0;

class Enemy {
    constructor(x, y) {
        this.waypointIndex = 0;
        this.x = x;
        this.y = y;
        this.speed = 2;
        this.health = 100;
        this.radius = 10;
        this.color = 'red';
        this.value = 25; // Progress points for defeating this enemy
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
        this.gridX = x;
        this.gridY = y;
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
        let weakestEnemy = null;
        let lowestHealth = Infinity;

        enemies.forEach(enemy => {
            const dx = enemy.x - this.x;
            const dy = enemy.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.range && enemy.health < lowestHealth) {
                lowestHealth = enemy.health;
                weakestEnemy = enemy;
            }
        });
        return weakestEnemy;
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
        if (this.target.health <= 0) {
            this.delete = true;
            return;
        }
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.speed) {
            this.target.health -= this.damage;
            if (this.target.health <= 0) {
                buildMeter += this.target.value;
            }
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
                ctx.fillStyle = '#555';
            } else {
                ctx.fillStyle = '#333';
            }
            ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }
}

function spawnEnemies() {
    if (frameCounter % 120 === 0) { // Spawn an enemy every 2 seconds
        enemies.push(new Enemy(waypoints[0].x, waypoints[0].y));
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    spawnEnemies();

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

    enemies = enemies.filter(e => e.health > 0 && e.waypointIndex < waypoints.length);
    projectiles = projectiles.filter(p => !p.delete);

    const buildMeterPercentage = (buildMeter / TOWER_COST) * 100;
    buildMeterProgress.style.width = `${buildMeterPercentage}%`;

    if (buildMeter >= TOWER_COST) {
        placementMode = true;
        document.body.style.cursor = 'pointer';
    } else {
        placementMode = false;
        document.body.style.cursor = 'default';
    }
    
    frameCounter++;
    requestAnimationFrame(gameLoop);
}

canvas.addEventListener('click', (event) => {
    if (!placementMode) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const gridX = Math.floor(x / TILE_SIZE);
    const gridY = Math.floor(y / TILE_SIZE);

    if (gridY < map.length && gridX < map[0].length && map[gridY][gridX] === 0) {
        const isOccupied = towers.some(t => t.gridX === gridX && t.gridY === gridY);
        if (!isOccupied) {
            towers.push(new Tower(gridX, gridY));
            buildMeter -= TOWER_COST;
        }
    }
});

// Start the game
towers.push(new Tower(3, 2)); // Start with one tower
gameLoop();
