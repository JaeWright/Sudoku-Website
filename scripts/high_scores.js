// add your code here
function generateTableHead(table) {
  let thead = table.createTHead();
  let row = thead.insertRow();
  var headers = new Array();
  headers = ["Date","Duration"];
  for (i=0;i<headers.length;i++){
    let th = document.createElement("th");
    let text=document.createTextNode(headers[i]);
    th.appendChild(text);
    row.appendChild(th);
  }
  row.id="sheader";
  
}

function generateTable(table) {
  var stock = new Array();
  stock[0] = new Array("2021/01/17","3:41");
  stock[1] = new Array("2021/01/21","4:01");
  stock[2] = new Array("2021/02/01","2:52");
  stock[3] = new Array("2021/02/17","3:08");
  stock[4] = new Array("2021/03/02","2:51");
  for (i=0;i<stock.length;i++) {
    let row = table.insertRow();
    row.id = "scores_row"+i;
    for (j=0;j<stock[i].length;j++) {
      let cell = row.insertCell();
      cell.id = "scores_cell"+i+j;
      let text = document.createTextNode(stock[i][j]);
      cell.appendChild(text);
    }
  }
}

let table = document.querySelector("#scores");
generateTable(table);
generateTableHead(table);