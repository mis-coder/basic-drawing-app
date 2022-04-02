//TODO: refactor code
//TODO: disable undo/redo functionality
const colorPicker = document.querySelector("#color-picker");
const thicknessSlider = document.querySelector("#thickness-slider");
const undoBtn = document.querySelector("#undo-btn");
const redoBtn = document.querySelector("#redo-btn");
const clearBtn = document.querySelector("#clear-btn");
const downloadBtn = document.querySelector("#download-btn");
const canvas = document.querySelector("#drawing-area");
const ctx = canvas.getContext("2d");

canvas.height = window.innerHeight - 64;
canvas.width = window.innerWidth;
let isDrawing = false;
const strokePaths = [];
const restoreStrokePaths = [];
let index = -1;
let rIndex = -1;

let penColor = "#DE3163";
let penThickness = 5;
ctx.font = "30px Arial";
ctx.textAlign = "center";
ctx.fillText(
  "start moving cursor on the white area!",
  canvas.width / 2,
  canvas.height / 2
);
const startDrawing = () => {
  if (strokePaths.length === 0) {
    clearDrawingArea();
  }
  isDrawing = true;
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
  penColor.style.backgroundColor = color;
};

//TODO: in progress
const undoYourMove = () => {
  if (index <= 0) {
    clearDrawingArea();
    return;
  }
  const path = strokePaths.pop();
  restoreStrokePaths.unshift(path);
  rIndex += 1;
  index -= 1;
  ctx.putImageData(strokePaths[index], 0, 0);
  console.log("U stroke: ", strokePaths);
  console.log("U restore: ", restoreStrokePaths);
};

//TODO
const redoYourMove = () => {
  if (rIndex === -1) {
    return;
  }
  ctx.putImageData(restoreStrokePaths.at(-1), 0, 0);
  const path = restoreStrokePaths.pop();
  strokePaths.push(path);
  index += 1;
  rIndex -= 1;
  console.log("R stroke: ", strokePaths);
  console.log("R restore: ", restoreStrokePaths);
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
redoBtn.addEventListener("click", redoYourMove);
