const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;
canvas.style.width = "800px";
canvas.style.height = "500px";

const player = { x: 1, y: 1, hp: 100, maxHp: 100 };

function loop() {
  ctx.fillStyle = "#1c3b1c";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const px = 200;
  const py = 250;

  ctx.fillStyle = "#4fc3f7";
  ctx.beginPath();
  ctx.arc(px, py, 26, 0, Math.PI * 2);
  ctx.fill();

  // BARRA DE VIDA (TESTE)
  ctx.fillStyle = "red";
  ctx.fillRect(px - 25, py - 45, 50, 6);

  ctx.fillStyle = "lime";
  ctx.fillRect(px - 25, py - 45, 50, 6);

  requestAnimationFrame(loop);
}

loop();
