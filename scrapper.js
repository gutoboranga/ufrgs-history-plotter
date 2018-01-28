var fs = require('fs');
var path = require('path');


function openFile(relativePath) {
  return fs.readFileSync(path.join(__dirname, relativePath), { encoding: 'utf8' });
}

function parseToDom(string) {
  var DomParser = require('dom-parser');
  var parser = new DomParser();
  
  return parser.parseFromString(string);
}

function getContent(dom) {
  let content = dom.getElementsByClassName("modelo1")[0]
  
  let oddRows = content.getElementsByClassName("modelo1odd");
  let evenRows = content.getElementsByClassName("modelo1even");

  let rows = oddRows.concat(evenRows);

  return rows.map(function(element) {
    let columns = element.getElementsByClassName("centro");
    
    return {
      'semester' : columns[0].innerHTML.replace(/ |\t/g, ''),
      'grade' : columns[1].innerHTML.replace(/ |\t/g, ''),
      'situation' : columns[2].innerHTML.replace(/ |\t/g, ''),
    };
  });
}

function groupBy(array, key) {
  var groups = [];
  
  while(array.length > 0) {
    var groupType = array[0][key];
    
    let groupElements = array.filter(function(element) {
      return element[key] == groupType;
    }).map(function(element) {
      return { 'grade' : element['grade'], 'situation' : element['situation'] };
    });
    
    array = array.filter(function(element) {
      return element[key] != groupType;
    });
    
    groups[groupType] = groupElements;
  }
  
  return groups;
}

function createDataFrame(history) {
  var dataframe = "";
  
  for (semester in history) {
    var gradesAmount = {
      'A' : 0,
      'B' : 0,
      'C' : 0,
      'D' : 0,
      'FF' : 0,
      '-' : 0,
    }
    
    var grades = groupBy(history[semester], 'grade')
    
    // pra cada nota que ocorreu no semestre, põe o número de ocorrências no dict gradesAmount
    for (g in grades) {
      gradesAmount[g] = grades[g].length
    }
    
    // escreve no data frame uma linha referente ao  semestre atual do laço
    dataframe += semester + " " + gradesAmount['A'] + " " + gradesAmount['B'] + " " + gradesAmount['C'] + " " + gradesAmount['D'] + " " + gradesAmount['FF'] + " " + gradesAmount['-'] + "\n"
  }
  
  return dataframe;
}

// main
let pageStr = openFile('history.html');
let dom = parseToDom(pageStr);

let content = getContent(dom);
let semesters = groupBy(content, 'semester')

let dataframe = createDataFrame(semesters);
console.log(dataframe);

//
// O dataframe tá no formato:
//
// SEMESTRE QUANT_A QUANT_B QUANT_C QUANT_D QUANT_FF QUANT_-
//
// Exemplo:
// 2017/2 0 2 0 0 0 2
//
// Obs.: - equivale a notas não computadas ainda, ou seja, disciplinas que ainda não terminaram
//
