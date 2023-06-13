function run() {
    var allRows = document.getElementsByTagName("tr");
    var exhibitSort = document.getElementById("exhibit-select");
    var exhibitSelected = exhibitSort.value;
    for (row of allRows) {
        var keep = row.className == exhibitSelected || row.className == "header" || exhibitSelected == "all";
        row.style.display = keep ? "table-row" : "none";
    }
    var url = "url('images/" + exhibitSelected + ".jpg')";
    console.log(url);
    document.body.style.backgroundImage = url;
    docoument.body.style.backgroundRepeat = no-repeat;
}

