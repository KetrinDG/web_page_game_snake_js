const canvas = document.getElementById("game-canvas");
const scoreElement = document.getElementById("game-score");
const startButton = document.getElementById("game-start");
const restartButton = document.getElementById("game-restart");

const ctx = canvas.getContext("2d");

const backgroundImage = new Image();
backgroundImage.src = "img/background.jpg";

const snakeImage = new Image();
snakeImage.src = "img/skills.png";

const foodImages = [
  "img/apple.png",
  "img/cherry.png",
  "img/apples.png"
];
let loadedFoodImages = [];
let loadedCount = 0;

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const cellSize = 20;
const snakeSpeed = 200;

let snake;
let food;
let direction;
let score;
let gameLoop;
let gameStarted = false;

function startGame() {
  if (gameStarted) {
    return;
  }

  snake = [
    { x: 8, y: 8 },
    { x: 7, y: 8 },
    { x: 6, y: 8 }
  ];
  food = getRandomFoodPosition();
  direction = "right";
  score = 0;

  scoreElement.style.display = "block";
  restartButton.style.display = "block";

  clearInterval(gameLoop);
  loadedCount = 0;
  loadedFoodImages = [];

  foodImages.forEach((foodImage, index) => {
    const image = new Image();
    image.src = foodImage;
    image.onload = () => {
      loadedCount++;
      loadedFoodImages[index] = image;

      if (loadedCount === foodImages.length) {
        startGameLoop();
      }
    };
  });

  document.addEventListener("keydown", handleKeyPress);
}

function startGameLoop() {
  gameLoop = setInterval(() => {
    update();
    draw();
  }, snakeSpeed);
  gameStarted = true;
}

function update() {
  const head = getSnakeHead();
  const newHead = { x: head.x, y: head.y };

  if (direction === "up") {
    newHead.y -= 1;
  } else if (direction === "down") {
    newHead.y += 1;
  } else if (direction === "left") {
    newHead.x -= 1;
  } else if (direction === "right") {
    newHead.x += 1;
  }

  if (isSnakeOnFood(newHead)) {
    score++;
    scoreElement.textContent = "Score: " + score;
    food = getRandomFoodPosition();
  } else {
    snake.pop();
  }

  if (isSnakeColliding(newHead)) {
    gameOver();
    return;
  }

  snake.unshift(newHead);
}

function draw() {
  ctx.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);
  drawSnake();
  drawFood();
}

function drawSnake() {
  snake.forEach(segment => {
    ctx.drawImage(snakeImage, segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
  });
}

function drawFood() {
  const currentFoodImage = loadedFoodImages[score % foodImages.length];
  ctx.drawImage(currentFoodImage, food.x * cellSize, food.y * cellSize, cellSize, cellSize);
}

function getSnakeHead() {
  return snake[0];
}

function isSnakeOnFood(position) {
  return position.x === food.x && position.y === food.y;
}

function isSnakeColliding(position) {
  const head = getSnakeHead();
  return (
    position.x < 0 ||
    position.y < 0 ||
    position.x >= canvasWidth / cellSize ||
    position.y >= canvasHeight / cellSize ||
    snake.some(segment => segment.x === position.x && segment.y === position.y && segment !== head)
  );
}

function getRandomFoodPosition() {
  return {
    x: Math.floor(Math.random() * (canvasWidth / cellSize)),
    y: Math.floor(Math.random() * (canvasHeight / cellSize))
  };
}

function handleKeyPress(event) {
  if (event.key === "ArrowUp" && direction !== "down") {
    direction = "up";
  } else if (event.key === "ArrowDown" && direction !== "up") {
    direction = "down";
  } else if (event.key === "ArrowLeft" && direction !== "right") {
    direction = "left";
  } else if (event.key === "ArrowRight" && direction !== "left") {
    direction = "right";
  }
}

function gameOver() {
  clearInterval(gameLoop);
  gameStarted = false;

  restartButton.style.display = "block";
  scoreElement.textContent = "The game is over. Your score is: " + score;
}

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);

scoreElement.style.display = "block";
