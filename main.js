const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

/* FIX CRÍTICO */
canvas.width = 800;
canvas.height = 500;
canvas.style.width = "800px";
canvas.style.height = "500px";

// GRID
const COLS = 6;
const ROWS = 3;
const TILE = 80;
const OFFSET_X = 100;
const OFFSET_Y = 100;

// ESTADO
let mode = "idle"; // idle | move | attack
let turn = "player";

// PERSONAGENS
const player = { x: 1, y: 1, hp: 100 };
const enemy = { x: 4, y: 1, hp: 80 };

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

function highlightTiles(list, color) {
  ctx.fillStyle = color;
  list.forEach(t => {
    ctx.fillRect(
      OFFSET_X + t.x * TILE,
      OFFSET_Y + t.y * TILE,
      TILE,
      TILE
    );
  });
}

// ================= LÓGICA =================
function getAdjacent(c) {
  return [
    { x: c.x + 1, y: c.y },
    { x: c.x - 1, y: c.y },
    { x: c.x, y: c.y + 1 },
    { x: c.x, y: c.y - 1 },
  ].filter(t =>
    t.x >= 0 && t.y >= 0 &&
    t.x < COLS && t.y < ROWS
  );
}

// ================= INPUT =================
canvas.addEventListener("click", e => {
  if (turn !== "player") return;

  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  const gx = Math.floor((mx - OFFSET_X) / TILE);
  const gy = Math.floor((my - OFFSET_Y) / TILE);

  if (gx < 0 || gy < 0 || gx >= COLS || gy >= ROWS) return;

  // Clique no player → alterna modo
  if (gx === player.x && gy === player.y) {
    mode = mode === "attack" ? "move" : "attack";
    return;
  }

  // Movimento
  if (mode === "move") {
    const ok = getAdjacent(player)
      .some(t => t.x === gx && t.y === gy);
    if (ok) {
      player.x = gx;
      player.y = gy;
      mode = "idle";
      endTurn();
    }
  }

  // Ataque
  if (mode === "attack") {
    const hit =
      gx === enemy.x &&
      gy === enemy.y &&
      getAdjacent(player)
        .some(t => t.x === gx && t.y === gy);

    if (hit) {
      enemy.hp -= 20;
      mode = "idle";
      endTurn();
    }
  }
});

// ================= TURNO =================
function endTurn() {
  turn = "enemy";
  setTimeout(() => {
    turn = "player";
  }, 700);
}

// ================= LOOP =================
function loop() {
  drawBackground();
  drawGrid();

  if (mode === "move")
    highlightTiles(getAdjacent(player), "rgba(0,150,255,0.4)");

  if (mode === "attack")
    highlightTiles(getAdjacent(player), "rgba(255,80,80,0.4)");

  drawChar(player, "#4fc3f7");
  drawChar(enemy, "#ef5350");

  requestAnimationFrame(loop);
}

loop();
