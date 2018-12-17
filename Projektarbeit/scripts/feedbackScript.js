const TITLE = document.getElementById("feedbackCountTitle");
const URL = "https://tonyspizzafactory.herokuapp.com/api/feedback";
const TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.MQ.bYceSpllpyYQixgNzDt7dpCkEojdv3NKD-85XLXfdI4";

let pizzaRatingArray = new Array(4).fill(0);
let priceRatingArray = new Array(3).fill(0);
let feedbackCount = 0;

let req = new XMLHttpRequest();
req.open("GET", URL, true);
req.onreadystatechange= function() {
    if(req.readyState === XMLHttpRequest.DONE && req.status === 200) {
        useJsonVals(JSON.parse(req.responseText));
        drawPieCharts();
    }else if(req.readyState === XMLHttpRequest.DONE && req.status === 400){
        console.log("display internal server error");
        alert("error while getting data");
    }
};
req.setRequestHeader("Authorization", TOKEN);
req.send();


function useJsonVals(json) {
    json.forEach(function (jsonElem) {
        feedbackCount++;
        switch (jsonElem["pizzaRating"]) {
            case "awesome":
                pizzaRatingArray[0] += 1;
                break;
            case "good":
                pizzaRatingArray[1] += 1;
                break;
            case "okay":
                pizzaRatingArray[2] += 1;
                break;
            case "poor":
                pizzaRatingArray[3] += 1;
                break;
        }

        switch (jsonElem["prizeRating"]) {
            case "fair":
                priceRatingArray[0] += 1;
                break;
            case "okay":
                priceRatingArray[1] += 1;
                break;
            case "expensive":
                priceRatingArray[2] += 1;
                break;
        }
    });

    if (feedbackCount > 0) {
        for (let i = 0; i < pizzaRatingArray.length; i++) {
            pizzaRatingArray[i] *= 100/feedbackCount;
        }

        for (let i = 0; i < priceRatingArray.length; i++) {
            priceRatingArray[i] *= 100/feedbackCount;
        }
    }

    TITLE.textContent = feedbackCount + " people have rated us so far!";

}

function drawPieCharts() {
    var chart = new CanvasJS.Chart("pizzaChartContainer", {
        animationEnabled: true,
        backgroundColor: "#e6e6e6",
        title: {
            text: "Pizza rating"
        },
        data: [{
            type: "pie",
            startAngle: -90,
            yValueFormatString: "##0.00\"%\"",
            indexLabel: "{label} {y}",
            dataPoints: [
                {y: pizzaRatingArray[0], label: "Awesome"},
                {y: pizzaRatingArray[1], label: "Good"},
                {y: pizzaRatingArray[2], label: "Okay"},
                {y: pizzaRatingArray[3], label: "Bad"}
            ]
        }]
    });
    var chart2 = new CanvasJS.Chart("priceChartContainer", {
        animationEnabled: true,
        backgroundColor: "#e6e6e6",
        title: {
            text: "Price rating"
        },
        data: [{
            type: "pie",
            startAngle: -90,
            yValueFormatString: "##0.00\"%\"",
            indexLabel: "{label} {y}",
            dataPoints: [
                {y: priceRatingArray[0], label: "Fair"},
                {y: priceRatingArray[1], label: "Okay"},
                {y: priceRatingArray[2], label: "Expensive"}
            ]
        }]
    });
    chart.render();
    chart2.render();
}