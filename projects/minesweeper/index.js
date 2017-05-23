function makeBoard(n, bombRate) {
  // creates n * n board of array vectors
  // @param {n} <int> Specify dimension
  // @param {bombRate} <float> Probability of bombs
  // @return <Array> "board" of <td> elements indexed at board[i][j]

  let board = [];

  function init() {
    // initializes board and randomizes bombs
    // @param none
    // @return void
    for (let i = 0; i < n; i++) {
      board.push([]);
      for (let j = 0; j < n; j++) {
        let isBomb = Math.random() > bombRate ? false : true;
        let $space = $('<td>').data({
          bomb: isBomb,
          clicked: false,
        });
        board[i].push($space);
      }
    }
  }

  function setAdjacent() {
    // traverses and calls calculateAdjacent() for each piece,
    // storing adjacent in piece object
    // @param none
    // @return void
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        board[i][j].data().adjacent = calculateAdjacent(i, j);
      }
    }
  }

  function calculateAdjacent(i, j) {
    // called with coords of one piece and calculates adjacent bombs
    // used within initAdjacent
    // @param {i} <int> vertical coordinate
    // @param {j} <int> horizontal coordinate
    // @return void
    let adjacent = 0;

    // get the top and bottom rows first
    for (let x = j - 1; x < j + 2; x++) {
      // try blocks to bypass errors when board[i][j] is undefined.
      try {
        if (board[i-1][x].data().bomb) adjacent++; // top
      } catch(e) {} // no handler needed, using catch like a 'continue'
      try {
        if (board[i+1][x].data().bomb) adjacent++; // bottom
      } catch(e) {}
    }
      // left and right adjacent
    try {
      if (board[i][j-1].data().bomb) adjacent++;
    } catch(e) {} // again, no handler is needed

    try {
      if (board[i][j+1].data().bomb) adjacent++;
    } catch(e) {} // but a catch block is necessary
    
    return adjacent;
  }

  // start the initialization captain!
  init();
  setAdjacent();
  return board;
}

function renderBoard(board) {
  // renders board onto #tableContainer element
  // @param {board} <Array> board generated from makeBoard
  // @return void

  function generateGrid(board) {
    // appends board array (holding <td>) onto an html table element
    // @param {board} <Array> board generated from makeBoard
    // @return {$grid} <HTML Element> <table> elem with board <td> elems appended
    let $grid = $('<table>');

    board.forEach(elems => {
      let $row = $('<tr>');
      $row.append(elems);
      $grid.append($row);
    })

    return $grid;
  }

  const $grid = generateGrid(board);
  $("#table-container").empty().append($grid);
}

function initGameRules() {
  // sets click handlers for game logic
  // @param none
  // @return none
  function togglePiece(self) {
    let space = $(self).data(), txt;
    space.clicked = true;

    if (space.bomb) {
      $(self).addClass('bomb');
      txt = 'bomb';
    } else {
      txt = space.adjacent;
    }
    $(self).text(txt);
  }

  function bombGoBoom() {
    // bomb go boom 
    $('td').each((i, space) => togglePiece(space));
  }

  $( "td" ).click(function() {
    togglePiece(this);
    if ($(this).data().bomb) bombGoBoom();
  });

}

function initGame(n, bombRate) {
  // call makeBoard
  const board = makeBoard(n, bombRate);
  // call the function that appends board to #table-container
  renderBoard(board);
  // initialize gameRules
  initGameRules();
}

$(document).ready(() => {
  initGame(5, .25)
})