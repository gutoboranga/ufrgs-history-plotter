var express = require('express');
var cors = require('cors')
var shell = require('shelljs');
var fs = require('fs');
var bodyParser = require('body-parser');
var shortid = require('shortid');
var scrap = require('./scrapper').scrap

var app = express();

let IMGS_DIR = "imgs/"
let IMG_EXT = ".png"

// let BASE_URL = "https://ufrgs-history-plotter-server.herokuapp.com"
let BASE_URL = "http://localhost:5000"

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
      
    console.log("/");
    res.send("I'm alive")

  } catch (e) {
    res.send(e);
  }
});

app.get("/test", function(req, res) {
    console.log("TEST");
    res.send("TEST");
});

app.get("/graph/:id", function(req, res) {
    
  var id = req.params.id;
  let path = IMGS_DIR + id + IMG_EXT
  
  console.log("> " + path + " was requested");

  // checa se o arquivo com nome do id existe
  if (fs.existsSync(path)) {
    // envia a imagem e a deleta em seguida
    sendFile(path, res, function() {
      deleteFile(path)
      console.log("> did send image " + id);
    })
  } else {
    res.send("erro")
  }
});

app.post('/api/create', (req, res) => {
  console.log("> api/create requested");
  let title = req.body.title
  let htmlAsString = req.body.file

  try {
    console.log("> will try to create dataframe");
    let dataframe = scrap(htmlAsString)
    console.log("> created dataframe");

    // deve salvar o dataframe em um arquivo dataframe.csv para depois rodar o script em R
    let filename = "dataframe.csv"

    saveToFile(dataframe, filename, function() {
      console.log("> saved dataframe to file");

      let id = shortid.generate();
      // let path = IMGS_DIR + id + IMG_EXT

      let inputName = filename;
      let outputName = IMGS_DIR + id + IMG_EXT;

      runRScript("plot.R", inputName, outputName)

      console.log("> did run script");

      let url = BASE_URL + "/graph/" + id;
      console.log("> " + outputName + " was created and is available at " + url);
      res.send(url);
    })

  } catch (e) {
    console.log(e);
    res.send("erro")
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
  console.log("> will save file in path " + path);
  fs.writeFile(path, content, function(err) {
      if(err) {
          console.log("> erro ao salvar o arquivo dataframe");
          throw "erro"
      } else {
        callback()
      }
  });
}

function moveFile(sourceFile, destPath, callback) {
  //include the fs, path modules
  let path = __dirname + '/' + sourceFile;

  fs.rename(sourceFile, destPath, (err) => {
    if (err) throw err;
    else callback()
  });
};

function runRScript(filename, inputname, outputname) {
  console.log("will run R script");
  
  let scriptPath = __dirname + '/' + filename
  let inputPath = __dirname + '/' + inputname
  let outputPath = __dirname + '/' + outputname
  
  console.log(scriptPath, inputPath, outputPath);
  
  let command = 'Rscript ' + scriptPath + ' ' + inputPath + ' ' +  outputPath
  console.log(command);
  
  shell.exec(command);
}

function deleteFile(filename) {
  shell.exec('rm ' + __dirname + '/' + filename);
}
