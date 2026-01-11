const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// FORÇA TAMANHO (CRÍTICO)
canvas.width = 800;
canvas.height = 500;

// GRID
const COLS = 6;
const ROWS = 3;
const TILE = 80;

let gameState = "battle";

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
    ctx.moveTo(x * TILE + 100, 100);
    ctx.lineTo(x * TILE + 100, ROWS * TILE + 100);
    ctx.stroke();
  }
  for (let y = 0; y <= ROWS; y++) {
    ctx.beginPath();
    ctx.moveTo(100, y * TILE + 100);
    ctx.lineTo(COLS * TILE + 100, y * TILE + 100);
    ctx.stroke();
  }
}

function drawCircle(char, color) {
  const px = 100 + char.x * TILE + TILE / 2;
  const py = 100 + char.y * TILE + TILE / 2;

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(px, py, 26, 0, Math.PI * 2);
  ctx.fill();
}

// ================= LOOP =================
function loop() {
  drawBackground();
  drawGrid();
  drawCircle(player, "#4fc3f7");
  drawCircle(enemy, "#ef5350");
  requestAnimationFrame(loop);
}

loop();
