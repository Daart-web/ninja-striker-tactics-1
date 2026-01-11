const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const GRID_COLS = 6;
const GRID_ROWS = 3;
const TILE_SIZE = 80;
const OFFSET_X = 80;
const OFFSET_Y = 60;

let gameState = "prepare";
let currentTurn = "player";
let selected = null;
let moveTiles = [];

const player = {
  x: 1,
  y: 1,
  hp: 100,
  maxHp: 100,
  moved: false
};

const enemy = {
  x: 4,
  y: 1,
  hp: 80,
  maxHp: 80
};

setTimeout(() => gameState = "battle", 1200);

// ================= GRID =================

function drawGrid() {
  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  for (let x = 0; x <= GRID_COLS; x++) {
    ctx.beginPath();
    ctx.moveTo(OFFSET_X + x * TILE_SIZE, OFFSET_Y);
    ctx.lineTo(OFFSET_X + x * TILE_SIZE, OFFSET_Y + GRID_ROWS * TILE_SIZE);
    ctx.stroke();
  }
  for (let y = 0; y <= GRID_ROWS; y++) {
    ctx.beginPath();
    ctx.moveTo(OFFSET_X, OFFSET_Y + y * TILE_SIZE);
    ctx.lineTo(OFFSET_X + GRID_COLS * TILE_SIZE, OFFSET_Y + y * TILE_SIZE);
    ctx.stroke();
  }
}

function highlightMoves() {
  ctx.fillStyle = "rgba(100,200,255,0.3)";
  moveTiles.forEach(t => {
    ctx.fillRect(
      OFFSET_X + t.x * TILE_SIZE,
      OFFSET_Y + t.y * TILE_SIZE,
      TILE_SIZE,
      TILE_SIZE
    );
  });
}

// ================= CHARACTER =================

function drawCharacter(char, color) {
  const px = OFFSET_X + char.x * TILE_SIZE + TILE_SIZE / 2;
  const py = OFFSET_Y + char.y * TILE_SIZE + TILE_SIZE / 2;

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(px, py, 26, 0, Math.PI * 2);
  ctx.fill();

  // HP
  ctx.fillStyle = "red";
  ctx.fillRect(px - 25, py - 42, 50, 6);
  ctx.fillStyle = "lime";
  ctx.fillRect(px - 25, py - 42, 50 * (char.hp / char.maxHp), 6);
}

// ================= UI =================

function drawUI() {
  ctx.fillStyle = "white";
  ctx.font = "18px Arial";
  ctx.fillText("Wave 1/3", 20, 30);
  ctx.fillText(
    currentTurn === "player" ? "Seu turno" : "Turno inimigo",
    300,
    30
  );

  if (gameState === "prepare") {
    ctx.font = "40px Arial";
    ctx.fillText("PREPARE!", 300, 260);
  }
}

// ================= INPUT =================

canvas.addEventListener("click", e => {
  if (gameState !== "battle") return;
  if (currentTurn !== "player") return;

  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left - OFFSET_X;
  const my = e.clientY - rect.top - OFFSET_Y;

  const gx = Math.floor(mx / TILE_SIZE);
  const gy = Math.floor(my / TILE_SIZE);

  if (gx < 0 || gy < 0 || gx >= GRID_COLS || gy >= GRID_ROWS) return;

  // Selecionar personagem
  if (gx === player.x && gy === player.y && !player.moved) {
    selected = player;
    moveTiles = getMoveTiles(player);
    return;
  }

  // Mover
  if (selected) {
    const valid = moveTiles.find(t => t.x === gx && t.y === gy);
    if (valid) {
      player.x = gx;
      player.y = gy;
      player.moved = true;
      selected = null;
      moveTiles = [];
      endPlayerTurn();
    }
  }
});

function getMoveTiles(char) {
  const dirs = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 }
  ];

  return dirs
    .map(d => ({ x: char.x + d.x, y: char.y + d.y }))
    .filter(t =>
      t.x >= 0 && t.y >= 0 &&
      t.x < GRID_COLS && t.y < GRID_ROWS &&
      !(t.x === enemy.x && t.y === enemy.y)
    );
}

// ================= TURN =================

function endPlayerTurn() {
  currentTurn = "enemy";
  setTimeout(enemyTurn, 800);
}

function enemyTurn() {
  if (enemy.hp <= 0) return;

  // ataque simples
  player.hp -= 10;
  player.moved = false;
  currentTurn = "player";
}

// ================= LOOP =================

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid();
  if (selected) highlightMoves();
  drawCharacter(player, "#4fc3f7");
  drawCharacter(enemy, "#ef5350");
  drawUI();

  requestAnimationFrame(gameLoop);
}

gameLoop();
