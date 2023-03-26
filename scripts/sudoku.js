let storedValue = "base";
let prevCell = null;
  
function generateTableHead(table) {
  let thead = table.createTHead();
  let row = thead.insertRow();
}
  
function generateTable(table) {
  var stock = new Array();
  stock[0] = new Array(-1,1,-1,-1,-1,-1,-1,9,-1);
  stock[1] = new Array(-1,-1,4,-1,-1,-1,2,-1,-1);
  stock[2] = new Array(-1,-1,8,-1,-1,5,-1,-1,-1);
  stock[3] = new Array(-1,-1,-1,-1,-1,-1,-1,3,-1);
  stock[4] = new Array(2,-1,-1,-1,4,-1,1,-1,-1);
  stock[5] = new Array(-1,-1,-1,-1,-1,-1,-1,-1,-1);
  stock[6] = new Array(-1,-1,1,8,-1,-1,6,-1,-1);
  stock[7] = new Array(-1,3,-1,-1,-1,-1,-1,8,-1);
  stock[8] = new Array(-1,-1,6,-1,-1,-1,-1,-1,-1);
  for (i=0;i<stock.length;i++) {
    let row = table.insertRow();
    row.id = "row"+i;
    for (j=0;j<stock[i].length;j++) {
      let cell = row.insertCell();
      if(stock[i][j]!=-1){
        cell.id = "bcell"+i+j;
        let text = document.createTextNode(stock[i][j]);
        cell.appendChild(text);
      }else{
        cell.id = "ncell"+i+j;
      }
    }
  }
}

let board = document.querySelector("#board");
generateTable(board);

function generatePalette(table){
  var content = new Array()
  content = [1,2,3,4,5,6,7,8,9];
  let row = table.insertRow();
  for (i=0;i<content.length;i++){
    let cell = row.insertCell();
    cell.id = "palette_cell"+i;
    let text = document.createTextNode(content[i]);
    cell.appendChild(text);
  }
  var img = document.createElement("img");
  img.src = "images/undo.png";
  let cell = row.insertCell();
  cell.id = "palette_cell"+row.length;
  cell.appendChild(img);
}

let palette = document.querySelector("#palette");
generatePalette(palette);

function storeInput(tableCell){
  storedValue = tableCell.innerHTML;
}
 
function placeValue(tableCell){
  if(storedValue!=="base" && (tableCell.id).charAt(0)=='n'){
    tableCell.innerHTML = null;
    let text = document.createTextNode(storedValue);
    tableCell.appendChild(text);
    prevCell = tableCell;
    errorCheck(tableCell);
    errorFix();
  }
  storedValue="base";
}

function undo(){
  if(prevCell!=null){
    prevCell.innerHTML = null;
    let text = document.createTextNode("");
    prevCell.appendChild(text);
    prevCell=null;
    errorFix();
  }
}

function errorCheck(tableCell){
  //checks row
  var row = tableCell.id[5];
  //console.log(row);
  let rowCheck = [];
  for (var i=0;i<board.rows[row].cells.length;i++){
    rowCheck.push(board.rows[row].cells[i].innerHTML);
  }
  
  var rowIndices = [];
  rowCheck.filter(function(yourArray, index) {
    if(yourArray == tableCell.innerHTML){
      rowIndices.push(index)
    }
  });

  //console.log(colIndices);
  if(rowIndices.length>1){
    for (var i=0;i<rowIndices.length;i++){
      board.rows[row].cells[rowIndices[i]].style.backgroundColor = "red";
    }
  }

  //checks column
  var col = tableCell.cellIndex;
  var colCheck = [];
  for (var i=0;i<board.rows.length;i++){
    colCheck.push(board.rows[i].cells[col].innerHTML);
  }
  //console.log(colCheck);
  var colIndices = [];
  colCheck.filter(function(yourArray, index) {
    if(yourArray == tableCell.innerHTML){
      colIndices.push(index)
    }
  });

  //console.log(colIndices);
  if(colIndices.length>1){
    for (var i=0;i<colIndices.length;i++){
      board.rows[colIndices[i]].cells[col].style.backgroundColor = "red";
    }
  }
  //checks 3x3
  let rowStart = Math.floor(row/3)*3;
  let colStart = Math.floor(col/3)*3;

  var block = new Array();
  block[0] = ['0','0','0'];
  block[1] = ['0','0','0'];
  block[2] = ['0','0','0'];

  for (var x=0;x<block.length;x++){
    for (var y=0;y<block[0].length;y++){
      block[x][y] = board.rows[rowStart+x].cells[colStart+y].innerHTML;
    }
  }

  var blockIndices = [];
  for (var x=0;x<block.length;x++){
    for (var y=0;y<block[0].length;y++){
      if (block[x][y]==tableCell.innerHTML){
        blockIndices.push([x,y]);
      }
    }
  }

  if (blockIndices.length>1){
    for (var i=0;i<blockIndices.length;i++){
      board.rows[rowStart+blockIndices[i][0]].cells[colStart+blockIndices[i][1]].style.backgroundColor = "red";
    }
  }


}


function errorFix(){
  var errors = [];
  var values = [];
  var errorIndex = [];
  //gets all errors in board
  for (var i = 0; i < board.rows.length; i++) {
    for (var j = 0; j < board.rows[i].cells.length; j++){
      if (board.rows[i].cells[j].style.backgroundColor=="red"){
        errors.push([i,j]);
        values.push(board.rows[i].cells[j].innerHTML);
      }
    };
  }
  //loop for each error
  for (var x=0;x<errors.length;x++){
    //checks for blank cells
    if (values[x]==''){
      board.rows[errors[x][0]].cells[errors[x][1]].style.backgroundColor="white";
    }else{
      //checks row
      for (var r=0;r<board.rows.length;r++){
        if(board.rows[errors[x][0]].cells[r].innerHTML==values[x]){
          errorIndex.push([errors[x][0],r]);
        }
      }
      //checks column
      for (var r=0;r<board.rows.length;r++){
        if(board.rows[r].cells[errors[x][1]].innerHTML==values[x]){
          errorIndex.push([r,errors[x][1]]);
        }
      }
      //check 3x3
      let rowStart = Math.floor(errors[x][0]/3)*3;
      let colStart = Math.floor(errors[x][1]/3)*3;

      for (var r=rowStart;r<rowStart+3;r++){
        for (var c=colStart;c<colStart+3;c++){
          if(board.rows[r].cells[c].innerHTML==values[x]){
            errorIndex.push([r,c]);
          }
        }
      }
      //if passes all checks, fixes error
      if(errorIndex.length<=3/*<3 cause thats max instances (including self)*/ ){
        board.rows[errors[x][0]].cells[errors[x][1]].style.backgroundColor="white";
      }
    }
    
    errorIndex = [];

  }
}


//take value from palette
if (palette != null) {
    for (var i = 0; i < palette.rows.length; i++) {
        for (var j = 0; j < palette.rows[i].cells.length; j++)
        palette.rows[i].cells[j].onclick = function () {
            storeInput(this);
        };
    }
}

//place value in board
if (board != null) {
  for (var i = 0; i < board.rows.length; i++) {
      for (var j = 0; j < board.rows[i].cells.length; j++)
      board.rows[i].cells[j].onclick = function () {
        placeValue(this);
      };
  }
}
//undo on click
palette.rows[0].cells[9].onclick = function () {
  undo();
};














