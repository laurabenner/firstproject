function run() {
    let allRows = document.getElementsByTagName("tr");
    let exhibitSort = document.getElementById("exhibit-select");
    let exhibitSelected = exhibitSort.value;

    let arrival = document.getElementById("arrival");
    let arrivalTime = arrival.value;
    let departure = document.getElementById("departure");
    let departureTime = departure.value;
    let allTimes = document.getElementsByClassName("time");

    for (let i=1; i<allRows.length; i++) {
        let time24 = allTimes[i-1].getAttribute("data-time");
        let keep1 = departureTime > time24 && arrivalTime < time24;
        let keep2 = allRows[i].className == exhibitSelected || exhibitSelected == "all";
        allRows[i].style.display = keep1 && keep2 ? "table-row" : "none";
    }
    let url = "url('images/" + exhibitSelected + ".jpg')";
    document.body.style.backgroundImage = url;
    document.body.style.backgroundRepeat = "no-repeat";
}

