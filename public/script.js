const canvas = document.getElementById('signatureCanvas');
const ctx = canvas.getContext('2d');
let painting = false;
let undoStack = [], redoStack = [];
let currentColor = '#000000'; // Default color
let currentThickness = 2; // Default thickness

// Handle color and thickness changes
function setColor(color) {
    currentColor = color;
    ctx.strokeStyle = currentColor;
}

function setThickness(thickness) {
    currentThickness = thickness;
    ctx.lineWidth = currentThickness;
}

// Continue with existing event handlers and functions
function startPosition(e) {
    painting = true;
    draw(e);
}

function finishedPosition() {
    painting = false;
    ctx.beginPath();
    saveState();
}

function draw(e) {
    if (!painting) return;
    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;

    ctx.lineWidth = currentThickness;
    ctx.strokeStyle = currentColor;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}


function getTouchPos(e) {
    if (e.touches) {
        e = e.touches[0];
    }
    return { x: e.clientX - canvas.offsetLeft, y: e.clientY - canvas.offsetTop };
}

function handleTouchMove(e) {
    e.preventDefault(); // Prevent scrolling when touching the canvas
    const pos = getTouchPos(e);
    draw(pos);
}

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', finishedPosition);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('touchstart', startPosition);
canvas.addEventListener('touchmove', handleTouchMove);
canvas.addEventListener('touchend', finishedPosition);

function saveState() {
    currentState = canvas.toDataURL();
    undoStack.push(currentState);
    redoStack = [];
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveState(); // Save the cleared state to allow undo
}

function undo() {
  if (undoStack.length > 1) {
      redoStack.push(undoStack.pop()); // Push the last action to redo stack
      restoreState(undoStack.pop()); // Remove the last state and restore the one before it
      undoStack.push(currentState); // Push the restored state back to undo stack
  }
}

function redo() {
  if (redoStack.length > 0) {
      const nextState = redoStack.pop();
      undoStack.push(nextState);
      restoreState(nextState);
  }
}

function restoreState(state) {
    const img = new Image();
    img.src = state;
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
}

function saveAsImage() {
    const dataURL = canvas.toDataURL('image/png');
    fetch('/save-image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageData: dataURL })
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.error('Error:', error));
}

function saveAsPDF() {
    const dataURL = canvas.toDataURL('image/png');
    fetch('/save-pdf', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageData: dataURL })
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.error('Error:', error));
}
