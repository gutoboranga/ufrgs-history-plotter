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

let BASE_URL = "http://localhost:5000/"

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

    // teste apenas
    // let id = shortid.generate();
    // let path = IMGS_DIR + id + IMG_EXT
    // let url = BASE_URL + "graph/" + id
    //
    // console.log(path);
    // console.log(url);

    // fim do teste

    // sendFile('test.png', res, function() {});
    res.send(url)

  } catch (e) {
    res.send(e);
  }
});

app.get("/graph", function(req, res) {
  sendFile('imgs/nova.png', res, function(){});
});

app.get("/graph/:id", function(req, res) {
  var id = req.params.id;
  let path = IMGS_DIR + id + IMG_EXT

  // checa se o arquivo com nome do id existe
  if (fs.existsSync(path)) {
    // envia a imagem e a deleta em seguida
    sendFile(path, res, function() {
      deleteFile(path)
    })
  } else {
    res.send(404)
  }
});

app.post('/api/create', (req, res) => {
  let title = req.body.title
  let htmlAsString = req.body.file

  try {
    let dataframe = scrap(htmlAsString)

    // deve salvar o dataframe em um arquivo dataframe.csv para depois rodar o script em R
    saveToFile(dataframe, "dataframe.csv", function() {
      runRScript("plot.R")

      let id = shortid.generate();
      let path = IMGS_DIR + id + IMG_EXT
      let url = BASE_URL + "graph/" + id

      moveFile("graph.png", path, function() {
        res.send(url);
      });
    })

  } catch (e) {
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

  fs.writeFile(path, content, function(err) {
      if(err) {
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

function runRScript(filename) {
  console.log("will run R script");
  shell.exec('Rscript ' + __dirname + '/' + filename);
}

function deleteFile(filename) {
  shell.exec('rm ' + __dirname + '/' + filename);
}
