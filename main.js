fetchDemos();

const totalDemos = getDemos().length;
let keepExhibit = new Array(totalDemos).fill(true);
let keepArrive = new Array(totalDemos).fill(true);
let keepDepart = new Array(totalDemos).fill(true);

function fetchDemos() {
    // Get 24-hour time strings
    const transformTime = timeString => timeString.replace(/(\d+):(\d+) (AM|PM)/, (_, h, m, p) => `${String(p === 'PM' ? +h + 12 : h).padStart(2, '0')}:${m}`);
    // Get hyphenated exhibit strings
    const transformExhibit = exhibitString => exhibitString.toLowerCase().replaceAll(" & ", "-").replaceAll(" ", "-").replaceAll("'", "");

    jsonData.forEach(demo => {
        const divElement = document.createElement("div");
        divElement.setAttribute('class', 'demo');
        divElement.setAttribute('data-time', transformTime(demo.Time));
        divElement.setAttribute('data-exhibit', transformExhibit(demo.Exhibit));

        const timeParagraph = document.createElement('p');
        timeParagraph.setAttribute('class', 'time');
        timeParagraph.textContent = demo.Time;

        const exhibitParagraph = document.createElement('p');
        exhibitParagraph.setAttribute('class', 'exhibit');
        const exhibitLink = document.createElement('a');
        exhibitLink.setAttribute('href', 'https://nationalzoo.si.edu/animals/exhibits/' + transformExhibit(demo.Exhibit));
        exhibitLink.textContent = demo.Exhibit.toUpperCase();
        exhibitParagraph.appendChild(exhibitLink);

        const descriptionParagraph = document.createElement('p');
        descriptionParagraph.setAttribute('class', 'description');
        descriptionParagraph.textContent = demo.Demo;

        divElement.appendChild(timeParagraph);
        divElement.appendChild(exhibitParagraph);
        divElement.appendChild(descriptionParagraph);

        const container = document.getElementById('demo-grid');
        container.appendChild(divElement);

        sortByTime();
    })
}

function changeArrivalTime() {
    let allDemos = getDemos();

    let arrivalTime = getArrivalTime();

    for (let i = 0; i < allDemos.length; i++) {
        let time = allDemos[i].getAttribute("data-time");
        keepArrive[i] = arrivalTime <= time;
        let keep = keepArrive[i] && keepDepart[i] && keepExhibit[i];
        console.log(keep);
        allDemos[i].style.display = keep ? "table-row" : "none";
    }
}

function changeDepartureTime() {
    let allDemos = getDemos();
    
    let departureTime = getDepartureTime();

    for (let i = 0; i < allDemos.length; i++) {
        let time = allDemos[i].getAttribute("data-time");
        keepDepart[i] = departureTime > time;
        let keep = keepArrive[i] && keepDepart[i] && keepExhibit[i];
        console.log(keep);
        allDemos[i].style.display = keep ? "table-row" : "none";
    }
}

function changeExhibit() {
    let allDemos = getDemos();

    let exhibitSelected = getExhibit();

    for (let i = 0; i < allDemos.length; i++) {
        keepExhibit[i] = allDemos[i].getAttribute("data-exhibit") == exhibitSelected || exhibitSelected == "all";
        let keep = keepArrive[i] && keepDepart[i] && keepExhibit[i];
        console.log(keep);
        allDemos[i].style.display = keep ? "table-row" : "none";
    }

    changePicture(exhibitSelected);
}

function sortByTime() {
    let allDemos = Array.from(getDemos());

    allDemos.sort((demoA, demoB) => {
        const timeA = demoA.getAttribute('data-time');
        const timeB = demoB.getAttribute('data-time');
      
        const dateA = new Date(`1970-01-01T${timeA}`);
        const dateB = new Date(`1970-01-01T${timeB}`);

        return dateA - dateB;
      });
    
    allDemos.forEach(demo => {
        const container = document.getElementById('demo-grid');
        container.appendChild(demo);
      })
}

function sortByExhibit() {
    let allDemos = Array.from(getDemos());

    allDemos.sort((demoA, demoB) => {
        const exhibitA = demoA.getAttribute('data-exhibit');
        const exhibitB = demoB.getAttribute('data-exhibit');

        return exhibitA.localeCompare(exhibitB);
      });
    
    allDemos.forEach(demo => {
        const container = document.getElementById('demo-grid');
        container.appendChild(demo);
      })
}

function getDemos() {
    return document.getElementsByClassName("demo");
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