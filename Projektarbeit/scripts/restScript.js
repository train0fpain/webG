const TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.MQ.bYceSpllpyYQixgNzDt7dpCkEojdv3NKD-85XLXfdI4";
const SERVER = "https://tonyspizzafactory.herokuapp.com/api/";
const PIZZA_GRID = document.getElementById("pizzaGrid");
const SALAD_GRID = document.getElementById("saladGrid");
const DRINK_GRID = document.getElementById("softdrinkGrid");
const SUBMIT_ELEMS = document.getElementById("submitForm").children[1].children;

placeProducts();

function sendGetRequest(url, grid, func, switchVal) {
    let req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.onreadystatechange= function() {
        if(req.readyState === XMLHttpRequest.DONE && req.status === 200) {

            let xmlDoc;
            if (window.DOMParser){
                let parser = new DOMParser();
                xmlDoc = parser.parseFromString(req.responseText, "text/xml")
            } else {    // internet explorer
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = false;
                xmlDoc.loadXML(req.responseText);
            }

            console.log(xmlDoc);
            switch (switchVal) {
                case 0:
                    xmlDoc.forEach(function (elem) {
                        grid.appendChild(addPizzaElem(elem));
                    })
                    break;
                case 1:
                    xmlDoc.forEach(function (elem) {
                        grid.appendChild(addSaladOrBeverageElem(elem, "dressing", ["Italian dressing", "French dressing"], true));
                    })
                    break;
                case 2:
                    xmlDoc.forEach(function (elem) {
                        grid.appendChild(addSaladOrBeverageElem(elem, "drink", ["50cl", "30cl"], false));
                    })
                    break;

            }

        }else if(req.readyState === XMLHttpRequest.DONE && req.status === 400){
            console.log("display internal server error");
            alert("error getting data");
        }
    };
    req.setRequestHeader("Authorization", TOKEN);
    req.send();
}

function sendPostRequest(url, jsonObj, redirect) {
    let req = new XMLHttpRequest();
    req.open("POST", url, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.onreadystatechange = function() {
        if (req.readyState === XMLHttpRequest.DONE && req.status === 201) {
            console.log("order sent");
            if (redirect){
                window.location.replace("./feedback.html");
            }
        }else if(req.readyState === XMLHttpRequest.DONE && req.status === 400){
            console.log("internal server error");
            alert("error while processing data");
        }
    };
    console.log(jsonObj);
    req.setRequestHeader("Authorization", TOKEN);
    req.send(jsonObj);
}

function placeProducts() {
    sendGetRequest(SERVER + "pizzas", PIZZA_GRID, addPizzaElem, 0);

    sendGetRequest(SERVER + "salads", SALAD_GRID, addSaladOrBeverageElem, 1);

    sendGetRequest(SERVER + "softdrinks", DRINK_GRID, addSaladOrBeverageElem, 2);
}

function addPizzaElem(json) {
    let figure = document.createElement("figure");
    figure.className = "gridElem";
    let img = document.createElement("img");
    img.src = json.getElementsByTagName("imageUrl")[0];

    let figcap = document.createElement("figcaption");

    let descr = document.createElement("div");
    descr.className = "productDescription";

    let ingredientsNode = document.createTextNode(json.getElementsByTagName("ingredients").join(', '));
    descr.appendChild(ingredientsNode);

    let priceBox = document.createElement("div");
    createPriceField(priceBox, json);

    let nameNode = document.createTextNode(json.getElementsByTagName("name")[0]);
    figcap.appendChild(nameNode);
    figcap.appendChild(document.createElement("br"));
    figcap.appendChild(descr);

    figure.appendChild(img);
    figure.appendChild(figcap);
    figure.appendChild(priceBox);

    return figure;
}

function addSaladOrBeverageElem(json, selectClass, selectOptions, hasDescription) {
    let figure = document.createElement("figure");
    figure.className = "gridElem";
    let img = document.createElement("img");
    img.src = json.getElementsByTagName("imageUrl")[0];

    let figcap = document.createElement("figcaption");
    let price = document.createElement("div");
    price.appendChild(createSelect(selectClass, selectOptions));
    createPriceField(price, json);

    let nameNode = document.createTextNode(json.getElementsByTagName("name")[0]);
    figcap.appendChild(nameNode);
    if (hasDescription) {
        figcap.appendChild(document.createElement("br"));
        let descr = document.createElement("div");
        descr.className = "productDescription";
        let ingredientsNode = document.createTextNode(json.getElementsByTagName("ingredients").join(', '));
        console.log(json.getElementsByTagName("ingredients").join(', '));
        descr.appendChild(ingredientsNode);
        figcap.appendChild(descr);
    }

    figure.appendChild(img);
    figure.appendChild(figcap);
    figure.appendChild(price);

    PIZZA_GRID.appendChild(figure);
    return figure;
}

function createSelect(selectClass, selectOptions) {
    let select = document.createElement("select");
    select.className = selectClass;
    selectOptions.forEach(function (string) {
        let option = document.createElement("option");
        option.text = string;
        select.add(option);
    })
    return select;
}

function createPriceField(priceBox, json) {
    priceBox.className = "priceBox";

    let price = document.createElement("div");
    price.className = "price";
    let priceNode = document.createTextNode(" "+json.getElementsByTagName("prize")[0]+" ");
    price.appendChild(priceNode);
    let buttonImg = document.createElement("img");
    buttonImg.src = "img/buy.png";
    buttonImg.className = "buyImg";
    let button = document.createElement("button");
    button.className = "buyButton";
    button.appendChild(buttonImg);
    button.onclick = function () {
        let figcaption = button.parentElement.parentElement.children[1];
        let unwantedTextLength = figcaption.firstChild.textContent.length;  // null check not necessary?
        console.log(figcaption.textContent);
        let name = figcaption.textContent.slice(0,unwantedTextLength);
        console.log(name);
        let gridId = figcaption.parentElement.parentElement.id;
        console.log(figcaption.parentElement.parentElement.id);
        let type = gridId.slice(0, gridId.length-4);
        let jsonObject = '{\n' +
            '"id":'+0+', \n' +
            '"type":"'+type+'", \n' +
            '"name":"'+name+'"\n' +
            '}';
        sendPostRequest(SERVER + "orders", jsonObject, false);
    };

    priceBox.appendChild(price);
    priceBox.appendChild(button);

    return priceBox;
}

function sendFeedback() {
    let localElems;

    let likeVal;
    localElems = SUBMIT_ELEMS[0].children;
    for (let i = 0; i < localElems.length; i++) {
        let outerDiv = localElems[i];
        if (outerDiv.firstChild.checked){
            likeVal = outerDiv.firstChild.value;
            break;
        }
    }

    let priceVal;
    localElems = SUBMIT_ELEMS[1].children;
    for (let i = 0; i < localElems.length; i++) {
        let outerDiv = localElems[i];
        if (outerDiv.firstChild.checked){
            priceVal = outerDiv.firstChild.value;
        }
    }

    let name = SUBMIT_ELEMS[2].children[0].value;
    let email = SUBMIT_ELEMS[3].children[0].value;
    let text = SUBMIT_ELEMS[4].children[0].value;

    let jsonString = '{\n' +
        '  "id": '+0+',\n' +
        '  "pizzaRating": "'+likeVal+'",\n' +
        '  "prizeRating": "'+priceVal+'",\n' +
        '  "name": "'+name+'",\n' +
        '  "email": "'+email+'",\n' +
        '  "feedback": "'+text+'"\n' +
        '}';

    sendPostRequest(SERVER + "feedback", jsonString, true);
    return false;
}
