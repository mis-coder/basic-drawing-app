const canvas = document.getElementById("drawing-area");
const ctx = canvas.getContext("2d");

let isDrawing = false;

const startDrawing = () => {
  isDrawing = true;
};

const endDrawing = () => {
  isDrawing = false;
  ctx.beginPath();
};

const drawWithMouse = (event) => {
  if (!isDrawing) return;

  ctx.lineWidth = 9;
  ctx.lineCap = "round";
  ctx.strokeStyle = "red";
  ctx.lineTo(
    event.clientX - canvas.offsetLeft,
    event.clientY - canvas.offsetTop
  );
  ctx.stroke();
};

const drawWithTouch = (event) => {
  if (!isDrawing) return;

  ctx.lineWidth = 9;
  ctx.lineCap = "round";
  ctx.strokeStyle = "red";
  ctx.lineTo(
    event.touches[0].clientX - canvas.offsetLeft,
    event.touches[0].clientY - canvas.offsetTop
  );
  ctx.stroke();
};

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", drawWithMouse);
canvas.addEventListener("mouseup", endDrawing);

canvas.addEventListener("touchstart", startDrawing);
canvas.addEventListener("touchmove", drawWithTouch);
canvas.addEventListener("touchend", endDrawing);
