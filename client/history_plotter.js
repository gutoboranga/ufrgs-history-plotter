function upload() {
  var file = document.getElementById('fileInput').value;
  
  console.log("will request");
  
  var xhr = createCORSRequest('GET', "https://ufrgs-history-plotter-server.herokuapp.com/test");
  
  if (!xhr) {
    throw new Error('CORS not supported');
  }
  
  xhr.onload = function() {
    var responseText = xhr.responseText;
    
    console.log('carregou');
    console.log(responseText);
    
    // var b64Response = btoa(responseText);
    
    // var data = unescape(encodeURIComponent(responseText));
    // data = btoa(data);
    //
    // var image = document.getElementById('resulting_image');
    // image.src = 'data:image/png;base64,'+ data;
  };
  
  xhr.send();
}

function getGraph() {
  var _img = document.getElementById('resulting_image');
  var newImg = new Image;
  
  newImg.onload = function() {
      _img.src = this.src;
  }
  newImg.src = 'https://ufrgs-history-plotter-server.herokuapp.com/test';
}

function httpGet(url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}
