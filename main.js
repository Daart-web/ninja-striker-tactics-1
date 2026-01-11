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
let selected = false;
let mode = "idle"; // idle | move
let currentTurn = "player";

// PERSONAGENS
const player = { x: 1, y: 1, hp: 100 };
const enemy  = { x: 4, y: 1, hp: 80 };

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

function drawChar(c, color) {
  const px = OFFSET_X + c.x * TILE + TILE / 2;
  const py = OFFSET_Y + c.y * TILE + TILE / 2;

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(px, py, 26, 0, Math.PI * 2);
  ctx.fill();

  // HP
  ctx.fillStyle = "red";
  ctx.fillRect(px - 25, py - 40, 50, 6);
  ctx.fillStyle = "lime";
  ctx.fillRect(px - 25, py - 40, c.hp / 2, 6);
}

function highlightMoves() {
  ctx.fillStyle = "rgba(0,150,255,0.35)";
  getMoveTiles(player).forEach(t => {
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

  const mx = (e.clientX - rect.left) * scaleX;
  const my = (e.clientY - rect.top) * scaleY;

  const gx = Math.floor((mx - OFFSET_X) / TILE);
  const gy = Math.floor((my - OFFSET_Y) / TILE);

  if (gx < 0 || gy < 0 || gx >= COLS || gy >= ROWS) return;

  // Clique no jogador → entrar em modo mover
  if (gx === player.x && gy === player.y) {
    mode = "move";
    return;
  }

  // Movimento
  if (mode === "move") {
    const valid = getMoveTiles(player)
      .some(t => t.x === gx && t.y === gy);

    if (valid) {
      player.x = gx;
      player.y = gy;
      mode = "idle";
      endTurn();
    }
  }
});

function getMoveTiles(c) {
  const dirs = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 }
  ];

  return dirs
    .map(d => ({ x: c.x + d.x, y: c.y + d.y }))
    .filter(t =>
      t.x >= 0 && t.y >= 0 &&
      t.x < COLS && t.y < ROWS &&
      !(t.x === enemy.x && t.y === enemy.y)
    );
}

// ================= TURNO =================
function endTurn() {
  currentTurn = "enemy";
  setTimeout(enemyTurn, 700);
}

function enemyTurn() {
  player.hp -= 10;
  currentTurn = "player";
}

// ================= LOOP =================
function loop() {
  drawBackground();
  drawGrid();
  if (mode === "move") highlightMoves();
  drawChar(player, "#4fc3f7");
  drawChar(enemy, "#ef5350");
  requestAnimationFrame(loop);
}

loop();
