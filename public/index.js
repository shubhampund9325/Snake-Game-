// Game Constants & Variables
let inputDir1 = {x: 0, y: 0}; // Player 1 direction
let inputDir2 = {x: 0, y: 0}; // Player 2 direction

const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');

let speed = 5;
let score1 = 0;
let score2 = 0;
let lastPaintTime = 0;

let snakeArr1 = [{x: 13, y: 15}]; // Player 1 Snake
let snakeArr2 = [{x: 5, y: 5}]; // Player 2 Snake

let food = {x: 6, y: 7};

// Game Functions
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

// Check if a snake collides with itself, walls, or the other snake
function isCollide(snake1, snake2) {
    // Check if snake1 collides with itself
    for (let i = 1; i < snake1.length; i++) {
        if (snake1[i].x === snake1[0].x && snake1[i].y === snake1[0].y) {
            return true;
        }
    }

    // Check if snake1 collides with snake2
    for (let segment of snake2) {
        if (snake1[0].x === segment.x && snake1[0].y === segment.y) {
            return true;
        }
    }

    // Check wall collision for snake1
    if (snake1[0].x >= 18 || snake1[0].x <= 0 || snake1[0].y >= 18 || snake1[0].y <= 0) {
        return true;
    }

    return false;
}

function gameEngine() {
    // Check collisions for both snakes
    if (isCollide(snakeArr1, snakeArr2) || isCollide(snakeArr2, snakeArr1)) {
        gameOverSound.play();
        musicSound.pause();
        alert("Game Over! Snakes collided. Press any key to restart.");
        inputDir1 = {x: 0, y: 0};
        inputDir2 = {x: 0, y: 0};
        snakeArr1 = [{x: 13, y: 15}];
        snakeArr2 = [{x: 5, y: 5}];
        musicSound.play();
        score1 = 0;
        score2 = 0;
        document.getElementById("player1ScoreBox").innerText = "Player 1 Score: 0";
        document.getElementById("player2ScoreBox").innerText = "Player 2 Score: 0";
    }

    // Check if Player 1 eats the food
    if (snakeArr1[0].x === food.x && snakeArr1[0].y === food.y) {
        foodSound.play();
        score1++;
        document.getElementById("player1ScoreBox").innerText = "Player 1 Score: " + score1;
        snakeArr1.unshift({x: snakeArr1[0].x + inputDir1.x, y: snakeArr1[0].y + inputDir1.y});
        generateFood();
    }

    // Check if Player 2 eats the food
    if (snakeArr2[0].x === food.x && snakeArr2[0].y === food.y) {
        foodSound.play();
        score2++;
        document.getElementById("player2ScoreBox").innerText = "Player 2 Score: " + score2;
        snakeArr2.unshift({x: snakeArr2[0].x + inputDir2.x, y: snakeArr2[0].y + inputDir2.y});
        generateFood();
    }

    // Move Player 1 Snake
    for (let i = snakeArr1.length - 2; i >= 0; i--) {
        snakeArr1[i + 1] = {...snakeArr1[i]};
    }
    snakeArr1[0].x += inputDir1.x;
    snakeArr1[0].y += inputDir1.y;

    // Move Player 2 Snake
    for (let i = snakeArr2.length - 2; i >= 0; i--) {
        snakeArr2[i + 1] = {...snakeArr2[i]};
    }
    snakeArr2[0].x += inputDir2.x;
    snakeArr2[0].y += inputDir2.y;

    // Display snakes and food
    board.innerHTML = "";
    displaySnake(snakeArr1, 'snake1');
    displaySnake(snakeArr2, 'snake2');
    displayFood();
}

function displaySnake(snake, className) {
    snake.forEach((segment, index) => {
        const element = document.createElement('div');
        element.style.gridRowStart = segment.y;
        element.style.gridColumnStart = segment.x;
        element.classList.add(index === 0 ? 'head' : className);
        board.appendChild(element);
    });
}

function displayFood() {
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

function generateFood() {
    let a = 2, b = 16;
    food = {
        x: Math.round(a + (b - a) * Math.random()),
        y: Math.round(a + (b - a) * Math.random())
    };
}

// Main logic
musicSound.play();
window.requestAnimationFrame(main);

window.addEventListener('keydown', e => {
    moveSound.play();

    // Player 1 Controls
    switch (e.key) {
        case "ArrowUp":
            inputDir1 = {x: 0, y: -1};
            break;
        case "ArrowDown":
            inputDir1 = {x: 0, y: 1};
            break;
        case "ArrowLeft":
            inputDir1 = {x: -1, y: 0};
            break;
        case "ArrowRight":
            inputDir1 = {x: 1, y: 0};
            break;
    }

    // Player 2 Controls
    switch (e.key) {
        case "w":
            inputDir2 = {x: 0, y: -1};
            break;
        case "s":
            inputDir2 = {x: 0, y: 1};
            break;
        case "a":
            inputDir2 = {x: -1, y: 0};
            break;
        case "d":
            inputDir2 = {x: 1, y: 0};
            break;
    }
});
// const socket = io();

// // Receive the initial game state
// socket.on("init", (state) => {
//     console.log("Game initialized", state);
// });

// // Receive updates from the server
// socket.on("update", (state) => {
//     // Update your local game state
//     snakeArr1 = state.snake1;
//     snakeArr2 = state.snake2;
//     food = state.food;
// });

// // Send player movement
// window.addEventListener("keydown", (e) => {
//     const direction = { x: 0, y: 0 };
//     if (e.key === "ArrowUp") direction.y = -1;
//     else if (e.key === "ArrowDown") direction.y = 1;
//     else if (e.key === "ArrowLeft") direction.x = -1;
//     else if (e.key === "ArrowRight") direction.x = 1;

//     socket.emit("move", { player: 1, direction }); // For player 1
// });

const socket = io();

// Join the game room (you could use a unique room ID or use a random one for each game)
const roomId = "gameRoom1"; // You can generate this dynamically or allow the players to choose
socket.emit("joinRoom", roomId);

// Listen for initial game state
socket.on("init", (gameState) => {
    console.log("Game initialized", gameState);
    // Initialize the game with the received game state (e.g., render the snake, food, etc.)
});

// Listen for game state updates
socket.on("update", (gameState) => {
    console.log("Game updated", gameState);
    // Update the game state on the client (e.g., move the snake, check collisions)
});

// Listen for the start game signal
socket.on("startGame", () => {
    console.log("Game started! Players can begin");
    // Start the game logic here
});

// Sending player movement
function movePlayer(player, direction) {
    socket.emit("move", { player, direction, roomId });
}

// Example of sending movement input for player 1
movePlayer(1, { x: 0, y: -1 }); // Moving player 1 up