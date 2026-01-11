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

// PERSONAGENS
const player = { x: 1, y: 1, hp: 100, maxHp: 100 };
const enemy  = { x: 4, y: 1, hp: 80,  maxHp: 80  };

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

  // barra de vida
  const barW = 50;
  const hpRatio = c.hp / c.maxHp;

  ctx.fillStyle = "red";
  ctx.fillRect(px - barW / 2, py - 42, barW, 6);

  ctx.fillStyle = "lime";
  ctx.fillRect(px - barW / 2, py - 42, barW * hpRatio, 6);
}

// ================= LÓGICA =================
function isAdjacent(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1;
}

// CLIQUE: mover OU atacar
canvas.addEventListener("click", e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  const gx = Math.floor((mx - OFFSET_X) / TILE);
  const gy = Math.floor((my - OFFSET_Y) / TILE);

  // clique no inimigo = ataque
  if (gx === enemy.x && gy === enemy.y) {
    if (isAdjacent(player, enemy)) {
      enemy.hp -= 15;
      if (enemy.hp < 0) enemy.hp = 0;
    }
    return;
  }

  // mover
  if (gx >= 0 && gx < COLS && gy >= 0 && gy < ROWS) {
    player.x = gx;
    player.y = gy;
  }
});

// ================= LOOP =================
function loop() {
  drawBackground();
  drawGrid();

  if (enemy.hp > 0) drawChar(enemy, "#ef5350");
  drawChar(player, "#4fc3f7");

  requestAnimationFrame(loop);
}

loop();
