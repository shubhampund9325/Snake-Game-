// import express from "express";
// import { static as expressStatic } from "express";
// import { createServer } from "http";
// import { Server } from "socket.io";

// const app = express();
// const server = createServer(app);
// const io = new Server(server);

// app.use(expressStatic("public")); // Place your frontend in the "public" folder

// // Game state
// let gameState = {
//     snake1: [{ x: 13, y: 15 }],
//     snake2: [{ x: 5, y: 5 }],
//     food: generateFood(),
//     score1: 0,
//     score2: 0
// };

// // Function to generate random food
// function generateFood() {
//     let a = 2, b = 16;
//     return {
//         x: Math.floor(a + (b - a) * Math.random()),
//         y: Math.floor(a + (b - a) * Math.random())
//     };
// }

// // Function to reset game state
// function resetGameState() {
//     return {
//         snake1: [{ x: 13, y: 15 }],
//         snake2: [{ x: 5, y: 5 }],
//         food: generateFood(),
//         score1: 0,
//         score2: 0
//     };
// }

// // Function to check collision
// function isCollide(snake) {
//     const head = snake[0];

//     // Check wall collision
//     if (head.x < 0 || head.x > 18 || head.y < 0 || head.y > 18) {
//         return true;
//     }

//     // Check self-collision
//     for (let i = 1; i < snake.length; i++) {
//         if (snake[i].x === head.x && snake[i].y === head.y) {
//             return true;
//         }
//     }
//     return false;
// }

// io.on("connection", (socket) => {
//     console.log("A user connected");

//     // Send the initial game state to the client
//     socket.emit("init", gameState);

//     // Handle player movement
//     socket.on("move", ({ player, direction }) => {
//         let currentSnake, scoreKey;

//         if (player === 1) {
//             currentSnake = gameState.snake1;
//             scoreKey = "score1";
//         } else if (player === 2) {
//             currentSnake = gameState.snake2;
//             scoreKey = "score2";
//         }

//         const head = currentSnake[0];
//         const newHead = { x: head.x + direction.x, y: head.y + direction.y };

//         // Check if food is consumed
//         if (newHead.x === gameState.food.x && newHead.y === gameState.food.y) {
//             currentSnake.unshift(newHead); // Add new head without removing tail
//             gameState[scoreKey] += 1;
//             gameState.food = generateFood(); // Generate new food
//         } else {
//             currentSnake.unshift(newHead);
//             currentSnake.pop(); // Remove the tail
//         }

//         // Check collisions
//         if (isCollide(currentSnake)) {
//             io.emit("gameOver", { player });
//             gameState = resetGameState(); // Reset the game state for a new round
//             return;
//         }

//         // Broadcast updated game state
//         io.emit("update", gameState);
//     });

//     socket.on("disconnect", () => {
//         console.log("A user disconnected");
//     });
// });

// server.listen(3000, () => {
//     console.log("Server is running on port 3000");
// });

import express from "express";
import { static as expressStatic } from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(expressStatic("public")); // Serve your game from the "public" folder

// Game state
let gameState = {
    snake1: [{ x: 13, y: 15 }],
    snake2: [{ x: 5, y: 5 }],
    food: { x: 6, y: 7 },
    score1: 0,
    score2: 0
};

let playersInRoom = {}; // Track players in each room

io.on("connection", (socket) => {
    console.log("A user connected");

    // When a player joins, assign them to a room
    socket.on("joinRoom", (roomId) => {
        socket.join(roomId); // Join the room
        console.log(`Player joined room: ${roomId}`);

        // If it's the first player, assign snake1 and score1
        if (!playersInRoom[roomId]) {
            playersInRoom[roomId] = 1; // Player 1
            socket.emit("init", gameState); // Send game state to the first player
        }
        // If it's the second player, assign snake2 and score2
        else if (playersInRoom[roomId] === 1) {
            playersInRoom[roomId] = 2; // Player 2
            socket.emit("init", gameState); // Send game state to the second player
            io.to(roomId).emit("startGame"); // Notify both players to start the game
        }
    });

    // Handle player movement
    socket.on("move", ({ player, direction, roomId }) => {
        if (player === 1) {
            gameState.snake1[0] = direction;
        } else if (player === 2) {
            gameState.snake2[0] = direction;
        }

        // Broadcast updated game state to both players in the room
        io.to(roomId).emit("update", gameState);
    });

    // When a player disconnects, handle cleanup
    socket.on("disconnect", () => {
        console.log("A user disconnected");
        // Cleanup: Remove player from the room or reset game state if needed
    });
});

// Start the server
server.listen(3000, () => {
    console.log("Server is running on port 3000");
});