const playBoard = document.querySelector(".play-board");
const scoreBoard = document.querySelector(".score");
const highScoreBoard = document.querySelector(".high-score");
const controller = document.querySelectorAll(".controller i")


let gameOver = false;
let pokeX, pokeY;
let snakeX = 5,
  snakeY = 5;
let velocityX = 0,
  velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;
let randomPokemon = "";

// Get high score from local storage or assign 0 and updat display
let highScore = localStorage.getItem("high-score") || 0;
highScoreBoard.innerText = `High Score: ${highScore}`;

function randPosition() {
  // Selecting a random Pokemon from the list
  let randomIndex = Math.floor(Math.random() * pokemon.length);
  // Updating the background image URL
  randomPokemon = pokemon[randomIndex];

  // Passing a random number between 1 - 30 inclusive as food position
  pokeX = Math.floor(Math.random() * 25) + 1;
  pokeY = Math.floor(Math.random() * 25) + 1;
}

function gameOverReset() {
  // Clear timer and reload page
  clearInterval(setIntervalId);
}

function changeDirection(e) {
  // Change velocity of player movement based on key press
  if (e.key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }
}

controller.forEach(key => {
  key.addEventListener("click", () => changeDirection({key: key.dataset.key }));
});

function startGame() {
  if(gameOver) {
    // Show the modal
    let modal = document.querySelector('.modal');
    modal.style.display = 'block';
  
    // Set the score in the modal
    let scoreSpan = document.getElementById('score');
    scoreSpan.textContent = score;
    return gameOverReset();
  } 
  // Create a food div including update to back-ground image
  let htmlMarkup = `<div class="food" style="grid-area: ${pokeY} / ${pokeX}; background-image: url('images/pokemon/${randomPokemon}.gif')"></div>`;
  // Checking if snake hit the food
  if (snakeX === pokeX && snakeY === pokeY) {
    randPosition();
    // Push food position to snake body array
    snakeBody.push([pokeX, pokeY]);
    score++;
    highScore = Math.max(highScore, score);
    localStorage.setItem("high-score",highScore);
    scoreBoard.innerText = `Score: ${score}`;
    highScoreBoard.innerText = `High Score: ${highScore}`;
  }

  // Update snake head position based on current velocity
  snakeX += velocityX;
  snakeY += velocityY;

  // Shifting forward the values of the elements in the snake body by one
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }

  // Set up first element of snake to current snake position
  snakeBody[0] = [snakeX, snakeY];
  
  // Setting gameboard boundary
  if(snakeX <= 0 || snakeX > 25 || snakeY <=0 || snakeY > 25) {
    return gameOver = true;
  }

  // Add div for each part of snake body
  for (let i = 0; i < snakeBody.length; i++) {
    htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    // Game over if snake hits it's own body
    if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]){
      gameOver = true;
    }
  }
  // Insert food div into the play-board element
  playBoard.innerHTML = htmlMarkup;

}

randPosition();
setIntervalId = setInterval(startGame, 100);
document.addEventListener("keydown", changeDirection);
