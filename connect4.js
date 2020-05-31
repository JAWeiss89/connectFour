/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;

let fire  = {class : "fire", symbol: "<i class='fas fa-fire'></i>"},
    water = {class : "water", symbol: "<i class='fas fa-water'></i>"},
    leaf = {class : "leaf", symbol: "<i class='fas fa-leaf'></i>"},
    wind  = {class : "wind", symbol: "<i class='fas fa-wind'></i>"};

let player1 = "";
let player2 = "";

let options = document.querySelectorAll(".option")
let chooseText = document.querySelector("#choose");
let player1Div = document.querySelector(".player-1");
let player2Div = document.querySelector(".player-2");
let introDiv = document.querySelector("#intro");
let gameDiv = document.querySelector("#game");
let headerText = document.querySelector("h1");
let button = document.querySelector("button");

for (let option of options) {
  option.addEventListener('click', function(event) {
    if (player2 === "") {
      if (player1 === "") {
        player1 = getElementObj(option.getAttribute("id"));
        console.log(player1)
        chooseText.innerText = "Player 2, choose your element";
        player1Div.append(createElementSelection(player1.class));
        option.remove();
      } else {
        player2 = getElementObj(option.getAttribute("id"));
        player2Div.append(createElementSelection(player2.class));
        console.log(`player1 = ${player1}`)
        console.log(`player2 = ${player2}`)
        option.remove();
        setTimeout(function() {
          introDiv.style.display="none";
          gameDiv.style.display="block";
          button.style.display="inline";
        }, 1000)
      }
    }
  })
}

function createElementSelection(elementString) {
  let newDiv = document.createElement('div');
  newDiv.classList.add(elementString);
  newDiv.classList.add("selection");
  newDiv.innerHTML = `<i class='fas fa-${elementString}'></i>`
  return newDiv;
}

function getElementObj(elementStr) {
  if (elementStr === "fire") {
    return fire;
  } else if (elementStr === "water") {
    return water;
  } else if (elementStr === "leaf") {
    return leaf;
  } else {
    return wind;
  }
}




let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

let gameOver = false;

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  for (let i=0; i<HEIGHT; i++) {
    let newRow = []
    for (let t=0; t<WIDTH; t++) {
      newRow[t]= null;
    }
    board.push(newRow);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  const htmlBoard = document.querySelector('#board');
  let top = document.createElement("tr"); // We create the top row
  top.setAttribute("id", "column-top"); // Give the top row an id of column-top
  top.addEventListener("click", handleClick); 

  for (var x = 0; x < WIDTH; x++) { // For specified width, we create that amount of cells in the top row
    var headCell = document.createElement("td");
    headCell.setAttribute("id", x); // and give each cell an ID of its position 
    top.append(headCell); // Add each td cell to the top row.
  }
  htmlBoard.append(top);

  for (var y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr"); // Create a row for whatever the specified height is. 
    for (var x = 0; x < WIDTH; x++) { // Create a cell within each row for whatever the specified width is. 
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`); //Each cell is given an id where first value specifies the row it's on and the second which cell it's on
      row.append(cell);
    }
    htmlBoard.append(row); // append the row with cells and their ID's to the table
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  for (let row = HEIGHT-1; row >= 0; row--){ //beginning at the bottom, check to see if it's empty. If so, then return this position in column
    if (board[row][x] === null) {
      return row;
    }
  }
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  let newPiece = document.createElement('div');
  let targetTD = document.getElementById(`${y}-${x}`);
  newPiece.classList.add('piece');
  if (currPlayer === 1) {
    newPiece.classList.add(player1.class);
    newPiece.innerHTML = player1.symbol;
  } else {
    newPiece.classList.add(player2.class);
    newPiece.innerHTML = player2.symbol;
  }
  targetTD.append(newPiece);
}

/** endGame: announce game end */

function endGame(msg) {
  headerText.innerText = `${msg}`;
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  if (!gameOver) {
    // get x from ID of clicked cell
    let x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    let y = findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    placeInTable(y, x);
    if (currPlayer === 1) {
      board[y][x] = 1;
    } else {
      board[y][x] = 2;
    }
    // check for win
    if (checkForWin()) {
      let winner = currPlayer;
      gameOver = true;
      setTimeout(function(){
        return endGame(`Player ${winner} wins!`);

      }, 1000)
      
    }

    // check for tie
    if (checkForTie()) {
      return endGame("It's a tie!!")
    }

    // switch players
    switchPlayers();


  }

}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

function checkForTie() {
  let gameIsTied = true;
  for (let i=0; i<HEIGHT; i++) {
    let rowIsFilled = board[i].every(function(cell) {
      return (cell !== null);
    })
    console.log(rowIsFilled)
    if (rowIsFilled === false) {
      gameIsTied = false;
    }
  }
  return gameIsTied;
}

function switchPlayers() {
  return (currPlayer === 1 ? currPlayer = 2 : currPlayer = 1);
}

makeBoard();
makeHtmlBoard();
