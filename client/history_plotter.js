let BASE_URL = "https://ufrgs-history-plotter-server.herokuapp.com/"

function loadFile(o) {
   var fr = new FileReader();
   
   fr.onload = function(e) {
     var content = e.target.result
     
     // let BASE_URL = "http://localhost:5000/"
     
     postFile(BASE_URL + "api/create", content, function(response) {
       if (response != "erro") {
         getGraph(response);
       } else {
           
         alert(response)//"Algum erro ocorreu");
       }
     })
   };
   
   fr.readAsText(o.files[0]);
}

function makeWakeUpRequest() {
	var xhr = createCORSRequest('GET', BASE_URL);
  
	if (!xhr) {
    	throw new Error('CORS not supported');
  	}
  	
  	xhr.send();
}

function postFile(url, file, callback) {
  var xhr = createCORSRequest('POST', url);
  
  if (!xhr) {
    throw new Error('CORS not supported');
  }
  
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function() {
    let responseText = xhr.responseText;
    
    callback(responseText);
  }
  
  var data = {
    file : file
  }
  
  dataAsString = JSON.stringify(data)
  
  xhr.send(dataAsString);
}

function getGraph(url) {
  var _img = document.getElementById('resulting_image');
  var newImg = new Image;
  
  newImg.onload = function() {
    _img.src = this.src;
  }
  newImg.src = url;
}

window.onload = function() {
	makeWakeUpRequest();
}

