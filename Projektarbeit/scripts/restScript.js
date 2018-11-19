// token: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.MQ.bYceSpllpyYQixgNzDt7dpCkEojdv3NKD-85XLXfdI4

let pizzaGrid = document.getElementById("pizzaGrid");
let saladGrid = document.getElementById("saladGrid");
let drinkGrid = document.getElementById("drinkGrid");
let productJson;
let selectClass;
let selectOptions;
let hasDescription;
placeProducts();

function sendGetRequest(url, grid, func) {
    let req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.onreadystatechange= function() {
        if(req.readyState === XMLHttpRequest.DONE && req.status === 200) {
            var json = JSON.parse(req.responseText);
            console.log(json);
            productJson = json;
            json.forEach(function (elem) {
                grid.appendChild(func(elem));
            })
        }else if(req.readyState === XMLHttpRequest.DONE && req.status === 400){
            console.log("display internal server error");
        }
    };
    req.setRequestHeader("Authorization", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.MQ.bYceSpllpyYQixgNzDt7dpCkEojdv3NKD-85XLXfdI4");
    req.send();
}

function placeProducts() {
    sendGetRequest("https://tonyspizzafactory.herokuapp.com/api/pizzas", pizzaGrid, addPizzaElem);

    selectClass = "dressing";
    selectOptions = ["Italian dressing", "French dressing"];
    hasDescription = true;
    sendGetRequest("https://tonyspizzafactory.herokuapp.com/api/salads", saladGrid, addSaladOrBeverageElem);

    selectClass = "drink";
    selectOptions = ["50cl", "30cl"];
    hasDescription = false;
    sendGetRequest("https://tonyspizzafactory.herokuapp.com/api/softdrinks", drinkGrid, addSaladOrBeverageElem);
}

function addPizzaElem(json) {
    let div = document.createElement("div");
    div.className = "gridElem";
    let figure = document.createElement("figure");
    let img = document.createElement("img");
    img.src = json["imageUrl"];


    let figcap = document.createElement("figcaption");
    let price = document.createElement("div");
    price.className = "price";

    let descr = document.createElement("div");
    descr.className = "productDescription";

    let priceNode = document.createTextNode(" "+json["prize"]+" ");
    price.appendChild(priceNode);

    let ingredientsNode = document.createTextNode(json["ingredients"].join(', '));
    descr.appendChild(ingredientsNode);

    let button = document.createElement("button");
    button.appendChild(document.createTextNode("Buy"));

    let nameNode = document.createTextNode(json["name"]);
    figcap.appendChild(nameNode);
    figcap.appendChild(price);
    figcap.appendChild(button);
    figcap.appendChild(document.createElement("br"));
    figcap.appendChild(descr);

    figure.appendChild(img);
    figure.appendChild(figcap);

    div.appendChild(figure);

    return div;
}

function addSaladOrBeverageElem(json) {
    let div = document.createElement("div");
    div.className = "gridElem";
    let figure = document.createElement("figure");
    let img = document.createElement("img");
    img.src = json["imageUrl"];

    let figcap = document.createElement("figcaption");
    let price = document.createElement("div");
    price.className = "price";

    let priceNode = document.createTextNode(" "+json["prize"]+" ");
    price.appendChild(priceNode);

    let button = document.createElement("button");
    button.appendChild(document.createTextNode("Buy"));

    let nameNode = document.createTextNode(json["name"]);
    figcap.appendChild(nameNode);
    figcap.appendChild(document.createElement("br"));

    if (hasDescription) {
        let descr = document.createElement("div");
        descr.className = "productDescription";
        let ingredientsNode = document.createTextNode(json["ingredients"].join(', '));
        descr.appendChild(ingredientsNode);
        figcap.appendChild(descr);
    }

    figure.appendChild(img);
    figure.appendChild(figcap);
    figure.appendChild(createSelect());
    figure.appendChild(price);
    figure.appendChild(button);

    div.appendChild(figure);
    pizzaGrid.appendChild(div);
    return div;
}

function createSelect() {
    let select = document.createElement("select");
    select.className = selectClass;
    selectOptions.forEach(function (string) {
        let option = document.createElement("option");
        option.text = string;
        select.add(option);
    })
    return select;
}


