// Minimal original animation for CI; not a Lemo-Opuscar demo or film template.
const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
window.DUR = 3;
window.EV = [];

window.render = function render(t) {
  const w = window.innerWidth, h = window.innerHeight;
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  const scale = Math.min(w / 540, h / 960);
  const offsetX = (w - 540 * scale) / 2, offsetY = (h - 960 * scale) / 2;
  ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
  ctx.fillStyle = "#101c2b";
  ctx.fillRect(0, 0, 540, 960);

  // Fixed coordinate system + time-driven motion make frame order irrelevant.
  ctx.strokeStyle = "#35516a";
  ctx.lineWidth = 1;
  for (let i = 0; i < 14; i++) {
    const y = 80 + i * 62;
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(500, y);
    ctx.stroke();
  }
  ctx.strokeStyle = "#f2bd5c";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.ellipse(270, 470, 169, 233, 0, 0, Math.PI * 2);
  ctx.stroke();

  const angle = 2 * Math.PI * (t / window.DUR);
  const x = 270 + 169 * Math.cos(angle);
  const y = 470 + 233 * Math.sin(angle);
  ctx.fillStyle = "#f2bd5c";
  ctx.beginPath();
  ctx.arc(x, y, 23, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#edf1eb";
  ctx.textAlign = "center";
  ctx.font = "bold 33px sans-serif";
  ctx.fillText("RENDER CHECK", 270, 110);
  ctx.font = "19px monospace";
  ctx.fillText("540 x 960  /  24 FPS", 270, 152);
  ctx.font = "17px monospace";
  ctx.fillText("FRAME TIME: " + t.toFixed(2) + "s", 270, 850);
  ctx.fillText("CODE > BROWSER > FFMPEG > MP4", 270, 892);
};

window.READY = true;
