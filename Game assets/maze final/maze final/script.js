class BeeMazeGame {
    constructor() {
        this.gridSize = 24; // Increased grid size
        this.mazeContainer = document.querySelector('.maze-container');
        this.generateBtn = document.querySelector('.generate-btn');
        this.grid = [];
        this.playerPosition = null;
        this.endPosition = null;

        this.setupEventListeners();
        this.createGrid();
    }

    setupEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generateMaze());
        document.addEventListener('keydown', (e) => this.handlePlayerMovement(e));
    }

    createGrid() {
        this.mazeContainer.innerHTML = '';
        this.mazeContainer.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
        
        for (let i = 0; i < this.gridSize; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.gridSize; j++) {
                const cell = document.createElement('div');
                cell.classList.add('maze-cell');
                cell.dataset.x = i;
                cell.dataset.y = j;
                this.mazeContainer.appendChild(cell);
                this.grid[i][j] = cell;
            }
        }
    }

    generateMaze() {
        // Reset grid
        this.grid.forEach(row => row.forEach(cell => {
            cell.classList.remove('wall', 'start', 'end', 'player', 'path');
        }));

        // Initialize all cells as walls
        this.grid.forEach(row => row.forEach(cell => {
            cell.classList.add('wall');
        }));

        // Generate maze using recursive backtracking
        const visited = Array(this.gridSize).fill().map(() => 
            Array(this.gridSize).fill(false)
        );

        const generatePath = (x, y) => {
            visited[x][y] = true;
            this.grid[x][y].classList.remove('wall');

            const directions = [
                [0, 2], [2, 0], [0, -2], [-2, 0]
            ].sort(() => Math.random() - 0.5);

            for (const [dx, dy] of directions) {
                const newX = x + dx;
                const newY = y + dy;
                const wallX = x + dx / 2;
                const wallY = y + dy / 2;

                if (this.isValidCell(newX, newY) && !visited[newX][newY]) {
                    // Remove wall between current and new cell
                    if (this.isValidCell(wallX, wallY)) {
                        this.grid[wallX][wallY].classList.remove('wall');
                    }
                    generatePath(newX, newY);
                }
            }
        };

        // Start maze generation from the start point
        const startX = 0;
        const startY = 0;
        generatePath(startX, startY);

        // Ensure the end point is reachable
        this.connectStartToEnd();

        // Set start and end points
        this.setStartAndEndPoints();

        // Automatically solve the maze
        this.solveMaze();
    }

    connectStartToEnd() {
        // Ensure the end point is reachable from the start point
        const endX = this.gridSize - 1;
        const endY = this.gridSize - 1;

        // Create a direct path from the last cell to the end point if necessary
        if (this.grid[endX - 1][endY].classList.contains('wall')) {
            this.grid[endX - 1][endY].classList.remove('wall');
        }
        if (this.grid[endX][endY - 1].classList.contains('wall')) {
            this.grid[endX][endY - 1].classList.remove('wall');
        }
    }

    setStartAndEndPoints() {
        // Fixed start point
        const startX = 0;
        const startY = 0;
        const startCell = this.grid[startX][startY];
        startCell.classList.add('start');
        this.playerPosition = { x: startX, y: startY };
        this.grid[startX][startY].classList.add('player');

        // Fixed end point
        const endX = this.gridSize - 1;
        const endY = this.gridSize - 1;
        const endCell = this.grid[endX][endY];
        endCell.classList.add('end');
        this.endPosition = { x: endX, y: endY };
    }

    handlePlayerMovement(event) {
        if (!this.playerPosition) return;

        const moves = {
            'ArrowUp':    { dx: -1, dy: 0 },
            'ArrowDown':  { dx: 1, dy: 0 },
            'ArrowLeft':  { dx: 0, dy: -1 },
            'ArrowRight': { dx: 0, dy: 1 }
        };

        const move = moves[event.key];
        if (!move) return;

        const newX = this.playerPosition.x + move.dx;
        const newY = this.playerPosition.y + move.dy;

        // Check if move is valid (within grid and not a wall)
        if (this.isValidCell(newX, newY) && 
            !this.grid[newX][newY].classList.contains('wall')) {
            // Remove player from current cell
            this.grid[this.playerPosition.x][this.playerPosition.y]
                .classList.remove('player');

            // Update player position
            this.playerPosition = { x: newX, y: newY };

            // Add player to new cell
            this.grid[this.playerPosition.x][this.playerPosition.y]
                .classList.add('player');

            // Check if player reached end
            if (this.playerPosition.x === this.endPosition.x || 
                this.playerPosition.y === this.endPosition.y) {
                alert('Congratulations! Bee Got to its nest!');
            }
        }
    }

    solveMaze() {
        const start = [this.playerPosition.x, this.playerPosition.y];
        const end = [this.endPosition.x, this.endPosition.y];

        const queue = [start];
        const visited = new Set();
        const parent = {};

        while (queue.length > 0) {
            const [x, y] = queue.shift();
            const key = `${x},${y}`;

            if (visited.has(key)) continue;
            visited.add(key);

          

            const neighbors = [
                [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]
            ];

            for (const [nx, ny] of neighbors) {
                if (this.isValidCell(nx, ny) && !this.grid[nx][ny].classList.contains('wall') && !visited.has(`${nx},${ny}`)) {
                    queue.push([nx, ny]);
                    parent[`${nx},${ny}`] = [x, y];
                }
            }
        }

        
    }

    highlightPath(parent, start, end) {
        let current = end;
        while (current.toString() !== start.toString()) {
            const [x, y] = current;
            this.grid[x][y].classList.add('path');
            current = parent[current.toString()];
        }
    }

    isValidCell(x, y) {
        return x >= 0 && x < this.gridSize && 
               y >= 0 && y < this.gridSize;
    }

    calculateDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new BeeMazeGame();
});