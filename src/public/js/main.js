function valuechange() {
    let value = document.getElementById('dropdown1').value;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {      
            let response = `${this.response}`;
            response = JSON.parse(response).data
            let e = document.getElementById('dropdown2');
            e.innerHTML = '';
            response.forEach(item => {
                let element = document.createElement('option');
                element.innerHTML = item;
                element.value = item;
                e.appendChild(element);
            });
          }
    };
    if(value == "COLLECTION") {
        xhttp.open("GET", "/getContentNames/COLLECTION", true);
        xhttp.send();
    }
    else if(value == "API") {
        xhttp.open("GET", "/getContentNames/API/testingCollection", true);
        xhttp.send();
    }
}

function change() {
    let radio = document.querySelector('input[name=action]:checked').value
    if(radio == "new") {
        document.querySelector("#dropdown1").setAttribute('disabled', '')
        valuechange()
    }
    else if (radio == "edit"){
        document.querySelector("#dropdown1").removeAttribute('disabled')
        valuechange()
    }
}

function promptCol(type) {
    const collection = type == "api" ? document.getElementById('dropdown2').value : null;
    const promptData = prompt("What do you want to call the new " + type);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {    
            valuechange()
        }
    }
    xhttp.open("GET", `/createCollection?name=${promptData}&type=${type}&colname=${collection}`, true);
    xhttp.send();
}

document.body.addEventListener("load", change());

