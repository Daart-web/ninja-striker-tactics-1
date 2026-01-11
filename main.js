const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const GRID_COLS = 6;
const GRID_ROWS = 3;
const TILE_SIZE = 80;

let gameState = "prepare";
let currentTurn = "player";

const player = {
  x: 1,
  y: 1,
  hp: 100,
  maxHp: 100
};

const enemy = {
  x: 4,
  y: 1,
  hp: 80,
  maxHp: 80
};

setTimeout(() => gameState = "battle", 1500);

// ================= DRAW =================

function drawGrid() {
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  for (let x = 0; x <= GRID_COLS; x++) {
    ctx.beginPath();
    ctx.moveTo(x * TILE_SIZE + 80, 60);
    ctx.lineTo(x * TILE_SIZE + 80, GRID_ROWS * TILE_SIZE + 60);
    ctx.stroke();
  }
  for (let y = 0; y <= GRID_ROWS; y++) {
    ctx.beginPath();
    ctx.moveTo(80, y * TILE_SIZE + 60);
    ctx.lineTo(GRID_COLS * TILE_SIZE + 80, y * TILE_SIZE + 60);
    ctx.stroke();
  }
}

function drawCharacter(char, color) {
  const px = char.x * TILE_SIZE + 120;
  const py = char.y * TILE_SIZE + 100;

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(px, py, 25, 0, Math.PI * 2);
  ctx.fill();

  // HP bar
  ctx.fillStyle = "red";
  ctx.fillRect(px - 25, py - 40, 50, 6);
  ctx.fillStyle = "lime";
  ctx.fillRect(px - 25, py - 40, 50 * (char.hp / char.maxHp), 6);
}

function drawUI() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Wave 1/3", 20, 30);

  if (gameState === "prepare") {
    ctx.font = "40px Arial";
    ctx.fillText("PREPARE!", 300, 260);
  }

  if (gameState === "battle") {
    ctx.font = "18px Arial";
    ctx.fillText(
      currentTurn === "player" ? "Seu turno" : "Turno inimigo",
      320,
      30
    );
  }
}

// ================= TURN SYSTEM =================

canvas.addEventListener("click", () => {
  if (gameState !== "battle") return;
  if (currentTurn !== "player") return;

  enemy.hp -= 20;
  currentTurn = "enemy";

  setTimeout(enemyTurn, 800);
});

function enemyTurn() {
  if (enemy.hp <= 0) return;
  player.hp -= 15;
  currentTurn = "player";
}

// ================= LOOP =================

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid();
  drawCharacter(player, "#4fc3f7");
  drawCharacter(enemy, "#ef5350");
  drawUI();

  requestAnimationFrame(gameLoop);
}

gameLoop();
