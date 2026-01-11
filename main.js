const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;

// GRID
const COLS = 6;
const ROWS = 3;
const TILE = 80;
const OFFSET_X = 100;
const OFFSET_Y = 100;

// ESTADO
let currentTurn = "player";
let selected = false;
let moveTiles = [];

// PERSONAGENS
const player = { x: 1, y: 1 };
const enemy = { x: 4, y: 1 };

// ================= DESENHO =================
function drawBackground() {
  ctx.fillStyle = "#1c3b1c";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawGrid() {
  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  for (let x = 0; x <= COLS; x++) {
    ctx.beginPath();
    ctx.moveTo(OFFSET_X + x * TILE, OFFSET_Y);
    ctx.lineTo(OFFSET_X + x * TILE, OFFSET_Y + ROWS * TILE);
    ctx.stroke();
  }
  for (let y = 0; y <= ROWS; y++) {
    ctx.beginPath();
    ctx.moveTo(OFFSET_X, OFFSET_Y + y * TILE);
    ctx.lineTo(OFFSET_X + COLS * TILE, OFFSET_Y + y * TILE);
    ctx.stroke();
  }
}

function drawCircle(char, color) {
  const px = OFFSET_X + char.x * TILE + TILE / 2;
  const py = OFFSET_Y + char.y * TILE + TILE / 2;

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(px, py, 26, 0, Math.PI * 2);
  ctx.fill();
}

function highlightMoves() {
  ctx.fillStyle = "rgba(0,150,255,0.3)";
  moveTiles.forEach(t => {
    ctx.fillRect(
      OFFSET_X + t.x * TILE,
      OFFSET_Y + t.y * TILE,
      TILE,
      TILE
    );
  });
}

// ================= INPUT =================
canvas.addEventListener("click", e => {
  if (currentTurn !== "player") return;

  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const mouseX = (e.clientX - rect.left) * scaleX;
  const mouseY = (e.clientY - rect.top) * scaleY;

  const gx = Math.floor((mouseX - OFFSET_X) / TILE);
  const gy = Math.floor((mouseY - OFFSET_Y) / TILE);

  if (gx < 0 || gy < 0 || gx >= COLS || gy >= ROWS) return;

  // Selecionar jogador
  if (gx === player.x && gy === player.y) {
    selected = true;
    moveTiles = getMoveTiles(player);
    return;
  }

  // Mover
  if (selected) {
    const valid = moveTiles.find(t => t.x === gx && t.y === gy);
    if (valid) {
      player.x = gx;
      player.y = gy;
      selected = false;
      moveTiles = [];
      currentTurn = "enemy";
      setTimeout(() => currentTurn = "player", 500);
    }
  }
});

function getMoveTi
