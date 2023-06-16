let currentTiles = new Array();
let keepExhibit = new Array(getTiles().length).fill(true);
let keepArrive = new Array(getTiles().length).fill(true);
let keepDepart = new Array(getTiles().length).fill(true);

function changeArrivalTime() {
    let allTiles = getTiles();

    let arrivalTime = getArrivalTime();

    for (let i = 0; i < allTiles.length; i++) {
        let time = allTiles[i].getAttribute("data-time");
        keepArrive[i] = arrivalTime <= time;
        let keep = keepArrive[i] && keepDepart[i] && keepExhibit[i];
        console.log(keep);
        allTiles[i].style.display = keep ? "table-row" : "none";
    }
}

function changeDepartureTime() {
    let allTiles = getTiles();
    
    let departureTime = getDepartureTime();

    for (let i = 0; i < allTiles.length; i++) {
        let time = allTiles[i].getAttribute("data-time");
        keepDepart[i] = departureTime > time;
        let keep = keepArrive[i] && keepDepart[i] && keepExhibit[i];
        console.log(keep);
        allTiles[i].style.display = keep ? "table-row" : "none";
    }
}

function changeExhibit() {
    let allTiles = getTiles();

    let exhibitSelected = getExhibit();

    for (let i = 0; i < allTiles.length; i++) {
        keepExhibit[i] = allTiles[i].getAttribute("data-exhibit") == exhibitSelected || exhibitSelected == "all";
        let keep = keepArrive[i] && keepDepart[i] && keepExhibit[i];
        console.log(keep);
        allTiles[i].style.display = keep ? "table-row" : "none";
    }

    changePicture(exhibitSelected);
}

function arrangeByExhibit() {
    let allTiles = document.getElementsByClassName("tile");

}

function arrangeByTime() {

}

function getTiles() {
    return document.getElementsByClassName("tile");
}

function getExhibit() {
    let exhibitSort = document.getElementById("exhibit-select");
    return exhibitSort.value;
}

function getArrivalTime() {
    let arrival = document.getElementById("arrival");
    return arrival.value;
}

function getDepartureTime() {
    let departure = document.getElementById("departure");
    return departure.value;
}

function changePicture(exhibitSelected) {
    let url = "url('images/" + exhibitSelected + ".jpg')";
    document.body.style.backgroundImage = url;
    document.body.style.backgroundRepeat = "no-repeat";
}