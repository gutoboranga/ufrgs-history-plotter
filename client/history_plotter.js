// let BASE_URL = "https://ufrgs-history-plotter-server.herokuapp.com"
let BASE_URL = "http://localhost:5000"

function loadFile(o) {
    var fr = new FileReader();
    
    setImage("#");
    
    fr.onload = function(e) {
        var content = e.target.result
        
        let target = document.getElementById('spinner_container');
        var spinner = new Spinner()
        
        spinner.spin(target);

        postFile(BASE_URL + "/api/create", content, function(response) {
            spinner.stop();
        
            if (response != "erro" && response != "" && response != null && response != undefined) {
                setImage(response);
            } else {
                alert("Algo deu errado :(");
            }
        }, function() {
            spinner.stop();
            alert("Algo deu errado :(");
        });
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

function postFile(url, file, callback, errorCallback) {
    var xhr = createCORSRequest('POST', url);
    
    if (!xhr) {
        throw new Error('CORS not supported');
    }
    
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        let responseText = xhr.responseText;
        
        callback(responseText);
    }
    
    xhr.onerror = function() {
        errorCallback();
    }
    
    var data = {
        file : file
    }
    
    dataAsString = JSON.stringify(data)
    
    xhr.send(dataAsString);
}

function setImage(source) {
    var _img = document.getElementById('resulting_image');
    var newImg = new Image;
    
    newImg.onload = function() {
        _img.src = this.src;
    }
    newImg.src = source;
}

window.onload = function() {
    console.log("did wake up request");
    makeWakeUpRequest();
}

