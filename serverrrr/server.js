var express = require('express');
var cors = require('cors')
var shell = require('shelljs');
var fs = require('fs');
var bodyParser = require('body-parser');
var scrap = require('./scrapper').scrap

var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(express.json());       // to support JSON-encoded bodies

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function() {
  var port = app.get('port').toString();
  console.log("Running on port " + port);
});

// ========================================================================================
//    ROUTES
// ========================================================================================

app.get('/', (req, res) => {
  try {
    // runRScript('test.R');
    
    console.log('tag is: ' + req.query.tag);
    
    sendFile('test.png', res, function() {
      // após enviar o arquivo, o deleta
      // deleteFile('graph.png');
    });

  } catch (e) {
    res.send(e);
  }
});

app.get("/graph", function(req, res) {
  sendFile('imgs/nova.png', res, function(){});
});

app.post('/api/create', (req, res) => {
  let title = req.body.title
  let htmlAsString = req.body.file
  
  try {
    console.log("trying");
    let dataframe = scrap(htmlAsString)
    
    // deve salvar o dataframe em um arquivo dataframe.csv para depois rodar o script em R
    saveToFile(dataframe, "dataframe.csv", function() {
      console.log("did save dataframe");
      runRScript("plot.R")
      
      console.log("did run R script");
      moveFile("graph.png", "imgs/nova.png")
      
      // deve gerar uma nova url para o recurso que será criado
      
      let newUrl = "http://localhost:5000/graph"
      
      res.send(newUrl);
    })
    
  } catch (e) {
    console.log("erro");
    res.send("erro")
  } finally {
    console.log("finally");
  }
});


// ========================================================================================
//    AUXILIAR FUNCTIONS
// ========================================================================================

function sendFile(filename, res, callback) {
  let path = __dirname + '/' + filename;
  
  fs.readFile(path, function(err, data) {
    if (err) {
      res.send(err);
      return;
    }
    
    res.writeHead(200, {'Content-Type': 'image/jpeg'});
    res.end(data); // Send the file data to the browser.
    
    callback();
  });
}

function saveToFile(content, filename, callback) {
  let path = __dirname + '/' + filename;
  
  fs.writeFile(path, content, function(err) {
      if(err) {
          // return console.log(err);
          throw "erro"
      } else {
        callback()
      }
  });
}

function moveFile(sourceFile, destPath) {
  //include the fs, path modules
  let path = __dirname + '/' + sourceFile;

  fs.rename(sourceFile, destPath, (err)=>{
    if(err) throw err;
    else console.log('Successfully moved');
  });
};

//move file1.htm from 'test/' to 'test/dir_1/'
// moveFile('./test/file1.htm', './test/dir_1/');

function runRScript(filename) {
  console.log("will run R script");
  shell.exec('Rscript ' + __dirname + '/' + filename);
}

function deleteFile(filename) {
  shell.exec('rm ' + __dirname + '/' + filename);
}