/* Connect Four:
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * the board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is an array of cells (board[y][x])
let htmlBoard = document.getElementById("board"); // Get the HTML board element

/* makeBoard: create in-JS board structure:
    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // Create an empty board with all cells set to null
  for (let y = 0; y < HEIGHT; y++) {
    board.push(Array.from({ length: WIDTH }));
  }
}

/* makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // Create the top row for selecting columns
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // Create the game board with rows and cells
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/* findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null; // Column is full
}

/* placeInTable: update DOM to place piece into HTML table of board with animation */

function placeInTable(y, x) {
  let piece = document.createElement("div");
  piece.classList.add("piece");
  piece.classList.add(`player${currPlayer}`);
  let cell = document.getElementById(`${y}-${x}`);
  cell.append(piece);

  // Triggering the animation by adding the "falling" class
  setTimeout(() => {
    piece.classList.add("falling");
  }, 0);
}

/* endGame: announce game end */

function endGame(msg) {
  alert(msg);
}

/* handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next available spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // Update the game state
  board[y][x] = currPlayer;

  // place piece in board and add to HTML table
  placeInTable(y, x);

  // Check for a win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // Check for a tie
  if (board.every((row) => row.every((cell) => cell))) {
    return endGame("It's a tie!");
  }

  // Switch players
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/* checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // Check for a win in all directions
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (
        _win(horiz) ||
        _win(vert) ||
        _win(diagDR) ||
        _win(diagDL)
      ) {
        return true;
      }
    }
  }
  return false;
}

// Add a reset button event listener
const resetButton = document.getElementById("reset-button");
resetButton.addEventListener("click", resetGame);

// Function to reset the game
function resetGame() {
  // Clear the board
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      board[y][x] = null;
      let cell = document.getElementById(`${y}-${x}`);
      cell.innerHTML = ''; // Clear the piece from the cell
    }
  }

  // Reset the current player to 1
  currPlayer = 1;

  // Remove the win message if it's displayed
  // (You can replace this part with a more sophisticated message handling)
  alertClose();
}

// Function to close the alert message
function alertClose() {
  let alertBox = document.querySelector(".alert");
  if (alertBox) {
    alertBox.parentNode.removeChild(alertBox);
  }
}

makeBoard();
makeHtmlBoard();