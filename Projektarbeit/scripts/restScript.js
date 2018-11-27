// token: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.MQ.bYceSpllpyYQixgNzDt7dpCkEojdv3NKD-85XLXfdI4

let pizzaGrid = document.getElementById("pizzaGrid");
let saladGrid = document.getElementById("saladGrid");
let drinkGrid = document.getElementById("drinkGrid");
let productJson;
placeProducts();

function sendGetRequest(url, grid, func, switchVal) {
    let req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.onreadystatechange= function() {
        if(req.readyState === XMLHttpRequest.DONE && req.status === 200) {
            var json = JSON.parse(req.responseText);
            console.log(json);
            productJson = json;
            switch (switchVal) {
                case 0:
                    json.forEach(function (elem) {
                        grid.appendChild(addPizzaElem(elem));
                    })
                    break;
                case 1:
                    json.forEach(function (elem) {
                        grid.appendChild(addSaladOrBeverageElem(elem, "dressing", ["Italian dressing", "French dressing"], true));
                    })
                    break;
                case 2:
                    json.forEach(function (elem) {
                        grid.appendChild(addSaladOrBeverageElem(elem, "drink", ["50cl", "30cl"], false));
                    })
                    break;

            }

        }else if(req.readyState === XMLHttpRequest.DONE && req.status === 400){
            console.log("display internal server error");
        }
    };
    req.setRequestHeader("Authorization", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.MQ.bYceSpllpyYQixgNzDt7dpCkEojdv3NKD-85XLXfdI4");
    req.send();
}

function placeProducts() {
    sendGetRequest("https://tonyspizzafactory.herokuapp.com/api/pizzas", pizzaGrid, addPizzaElem, 0);

    sendGetRequest("https://tonyspizzafactory.herokuapp.com/api/salads", saladGrid, addSaladOrBeverageElem, 1);

    sendGetRequest("https://tonyspizzafactory.herokuapp.com/api/softdrinks", drinkGrid, addSaladOrBeverageElem, 2);
}

function addPizzaElem(json) {
    let figure = document.createElement("figure");
    figure.className = "gridElem";
    let img = document.createElement("img");
    img.src = json["imageUrl"];

    let figcap = document.createElement("figcaption");

    let descr = document.createElement("div");
    descr.className = "productDescription";

    let ingredientsNode = document.createTextNode(json["ingredients"].join(', '));
    descr.appendChild(ingredientsNode);

    let priceBox = document.createElement("div");
    createPriceField(priceBox, json);

    let nameNode = document.createTextNode(json["name"]);
    figcap.appendChild(nameNode);
    figcap.appendChild(document.createElement("br"));
    figcap.appendChild(descr);
    figcap.appendChild(priceBox);

    figure.appendChild(img);
    figure.appendChild(figcap);

    return figure;
}

function addSaladOrBeverageElem(json, selectClass, selectOptions, hasDescription) {
    let figure = document.createElement("figure");
    figure.className = "gridElem";
    let img = document.createElement("img");
    img.src = json["imageUrl"];

    let figcap = document.createElement("figcaption");
    let price = document.createElement("div");
    price.appendChild(createSelect(selectClass, selectOptions));
    createPriceField(price, json);

    let nameNode = document.createTextNode(json["name"]);
    figcap.appendChild(nameNode);
    if (hasDescription) {
        figcap.appendChild(document.createElement("br"));
        let descr = document.createElement("div");
        descr.className = "productDescription";
        let ingredientsNode = document.createTextNode(json["ingredients"].join(', '));
        console.log(json["ingredients"].join(', '));
        descr.appendChild(ingredientsNode);
        figcap.appendChild(descr);
    }

    figure.appendChild(img);
    figure.appendChild(figcap);
    figure.appendChild(price);

    pizzaGrid.appendChild(figure);
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
    let priceNode = document.createTextNode(" "+json["prize"]+" ");
    price.appendChild(priceNode);
    let buttonImg = document.createElement("img");
    buttonImg.src = "img/buy.png";
    buttonImg.className = "buyImg";
    let button = document.createElement("button");
    button.className = "buyButton";
    button.appendChild(buttonImg);

    priceBox.appendChild(price);
    priceBox.appendChild(button);

    return priceBox;
}


