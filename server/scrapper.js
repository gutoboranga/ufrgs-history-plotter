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

function getCompletionStatus(dom) {

    let obrigatoriosDone = document.getElementsByClassName('tab_pequena modelo1odd')[0].children[1].innerText.replace(/\s/g, "")
    
    let eletivosDone = document.getElementsByClassName('tab_pequena modelo1odd')[1].children[1].innerText.replace(/\s/g, "")
    
    let complementaresDone = document.getElementsByClassName('tab_pequena modelo1even')[1].children[1].innerText.replace(/\s/g, "")
    
    let obrigatoriosCurriculo = document.getElementsByClassName('tab_pequena modelo1odd')[3].children[1].innerText.replace(/\s/g, "")
    
    let eletivosCurriculo = document.getElementsByClassName('tab_pequena modelo1odd')[4].children[1].innerText.replace(/\s/g, "")
    
    let complementaresCurriculo = document.getElementsByClassName('tab_pequena modelo1even')[3].children[1].innerText.replace(/\s/g, "")
    
    return {
        "obrigatorios" : {
            "done" : obrigatoriosDone,
            "total" : obrigatoriosCurriculo
        },
        "eletivos" : {
            "done" : eletivosDone,
            "total" : eletivosCurriculo
        },
        "complementares" : {
            "done" : complementaresDone,
            "total" : complementaresCurriculo
        }
    }
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

function createStatusDataframe(status) {
    var dataframe = ""
    
    dataframe += status["obrigatorios"]["done"] + "," + status["eletivos"]["done"] + "," + status["complementares"]["done"] + "\n"
    dataframe += status["obrigatorios"]["total"] + "," + status["eletivos"]["total"] + "," + status["complementares"]["total"]
    
    return "OBRIGATORIOS,ELETIVOS,COMPLEMENTARES\n" + dataframe
}

function createDataFrame(history) {
  var dataframe = ""
  
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
    dataframe = semester + "," + gradesAmount['A'] + "," + gradesAmount['B'] + "," + gradesAmount['C'] + "," + gradesAmount['D'] + "," + gradesAmount['FF'] + "," + gradesAmount['-'] + "\n" + dataframe
  }
  
  dataframe = "SEMESTRE,QUANT_A,QUANT_B,QUANT_C,QUANT_D,QUANT_FF,QUANT_UNDEFINED\n" + dataframe
  
  return dataframe;
}

function scrapStatus(string) {
    let dom = parseToDom(string);
    try {
      let content = getCompletionStatus(dom);
      let dataframe = createStatusDataframe(content);
      
      return dataframe
    } catch (e) {
      throw e
    }
}

function scrap(string) {
  let dom = parseToDom(string);
  try {
    let content = getContent(dom);
    let semesters = groupBy(content, 'semester')
    
    let dataframe = createDataFrame(semesters);
    
    return dataframe
  } catch (e) {
    throw e
  }
}

// main
// let pageStr = openFile('history.html');
// let dom = parseToDom(pageStr);
//
// let content = getContent(dom);
// let semesters = groupBy(content, 'semester')
//
// let dataframe = createDataFrame(semesters);
//
// console.log(dataframe);

module.exports = {
  scrap : scrap,
  scrapStatus : scrapStatus
}

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
