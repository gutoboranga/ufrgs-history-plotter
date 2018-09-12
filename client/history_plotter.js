function loadFile(o) {
   var fr = new FileReader();
   
   fr.onload = function(e) {
     var content = e.target.result
     
     postFile("http://localhost:5000/api/create", content, function(response) {
       if (response != "erro") {
         getGraph(response);
       } else {
         alert("Algum erro ocorreu");
       }
     })
   };
   
   fr.readAsText(o.files[0]);
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
    title : "teste da vaca louca",
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
