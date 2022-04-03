/* ----------------- DOM Elements ----------------- */
const colorPicker = document.querySelector("#color-picker");
const thicknessSlider = document.querySelector("#slider");
const undoBtn = document.querySelector("#undo-btn");
const clearBtn = document.querySelector("#clear-btn");
const downloadBtn = document.querySelector("#download-btn");
const canvas = document.querySelector("#drawing-area");
const ctx = canvas.getContext("2d");

let isDrawing = false;

const strokePaths = [];
let index = -1;

let penColor = "#DE3163";
let penThickness = 5;
const initialText = "start moving cursor on the white area!";

const initializeCanvas = () => {
  canvas.height = window.innerHeight - 64;
  canvas.width = window.innerWidth;
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.fillText(initialText, canvas.width / 2, canvas.height / 2);
  disableUndoBtn();
};

const startDrawing = () => {
  if (strokePaths.length === 0) {
    clearDrawingArea();
  }
  isDrawing = true;
  enableUndoBtn();
};

const endDrawing = () => {
  isDrawing = false;
  strokePaths.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  index += 1;
  ctx.beginPath();
};

const setPenStyle = (styles) => {
  const { thickness, color, capStyle } = styles;
  ctx.lineWidth = thickness;
  ctx.lineCap = capStyle;
  ctx.strokeStyle = color;
};

const drawWithMouse = (event) => {
  if (!isDrawing) return;

  setPenStyle({ thickness: penThickness, color: penColor, capStyle: "round" });
  ctx.lineTo(
    event.clientX - canvas.offsetLeft,
    event.clientY - canvas.offsetTop
  );
  ctx.stroke();
};

const drawWithTouch = (event) => {
  if (!isDrawing) return;

  setPenStyle({ thickness: penThickness, color: penColor, capStyle: "round" });
  ctx.lineTo(
    event.touches[0].clientX - canvas.offsetLeft,
    event.touches[0].clientY - canvas.offsetTop
  );
  ctx.stroke();
};

const setPenColor = (event) => {
  const color = event.target.value;
  penColor = color;
};

const disableUndoBtn = () => {
  undoBtn.classList.add("disabled");
};

const enableUndoBtn = () => {
  undoBtn.classList.remove("disabled");
};

const undoYourMove = () => {
  if (index <= 0) {
    clearDrawingArea();
    disableUndoBtn();
    return;
  } else if (index > 0) {
    enableUndoBtn();
    strokePaths.pop();
    index -= 1;
    ctx.putImageData(strokePaths[index], 0, 0);
  }
};

const clearDrawingArea = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const downloadDrawingImage = (event) => {
  event.target.href = canvas.toDataURL();
};

const setPenThickness = (event) => {
  penThickness = event.target.value;
};

/* ----------------- Event Listeners ----------------- */
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", drawWithMouse);
canvas.addEventListener("mouseup", endDrawing);

canvas.addEventListener("touchstart", startDrawing);
canvas.addEventListener("touchmove", drawWithTouch);
canvas.addEventListener("touchend", endDrawing);

colorPicker.addEventListener("change", setPenColor);
thicknessSlider.addEventListener("change", setPenThickness);

downloadBtn.addEventListener("click", downloadDrawingImage);
clearBtn.addEventListener("click", clearDrawingArea);
undoBtn.addEventListener("click", undoYourMove);

window.addEventListener("load", initializeCanvas);
