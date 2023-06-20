let keepExhibit;
let keepArrive;
let keepDepart;
fetchDemos();
fetchAnimals();

function fetchDemos() {
    fetch("jsonData.json")
        .then(response => response.json())
        .then(data => {
            data.forEach(demo => addDemoToPage(demo));
            sortByTime();
            initializeKeeps();
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

function fetchAnimals() {
    let animalList = new Array();
    let exhibitList = new Array();
    let imageList = new Array();

    fetch("animaldata.json")
        .then(response => response.json())
        .then(data => {
            const dataArray = Object.values(data);
            dataArray.forEach(animal => {
                if (Array.isArray(animal.exhibit_name) && animal.exhibit_name.length > 0) {
                    animalList.push(transformAnimalString(animal.title));
                    exhibitList.push(transformExhibitString(animal.exhibit_name[0]));
                    imageList.push(animal.image_small);
                }
            });
            addAnimalsToPage(animalList, imageList);
        })
        .catch(error => {
            console.error("Error: ", error);
        })
}

function addAnimalsToPage(animalList, imageList) {
    const animalGrid = document.getElementById("animal-grid");
    for (let i = 0; i < animalList.length; i++) {
        const animalLink = document.createElement("a");
        animalLink.setAttribute("href", getAnimalUrl(animalList[i]));
        animalLink.setAttribute("target", "_blank");
        const divElement = document.createElement("div");
        divElement.setAttribute("class", "animal");
        divElement.appendChild(animalLink);
        const animalImage = document.createElement("img");
        animalImage.setAttribute("src", imageList[i]);
        animalLink.appendChild(animalImage);
        const animalTitle = document.createElement("p");
        animalTitle.textContent = animalList[i];
        animalLink.appendChild(animalTitle);
        animalGrid.appendChild(divElement);
    }
}

function addDemoToPage(demo) {
    const divElement = createDiv(demo);
    const timeParagraph = createTimeParagraph(demo);
    const exhibitParagraph = createExhibitParagraph(demo);
    const descriptionParagraph = createDescriptionParagraph(demo);
    const container = document.getElementById("demo-grid");

    divElement.appendChild(timeParagraph);
    divElement.appendChild(exhibitParagraph);
    divElement.appendChild(descriptionParagraph);
    container.appendChild(divElement);
}

function changeArrivalTime() {
    let allDemos = getDemos();

    let arrivalTime = getArrivalTime();

    for (let i = 0; i < allDemos.length; i++) {
        let time = allDemos[i].getAttribute("data-time");
        keepArrive[i] = arrivalTime <= time;
        let keep = keepArrive[i] && keepDepart[i] && keepExhibit[i];
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
        allDemos[i].style.display = keep ? "table-row" : "none";
    }
}

function changeExhibit() {
    let allDemos = getDemos();

    let exhibitSelected = getExhibit();

    for (let i = 0; i < allDemos.length; i++) {
        keepExhibit[i] = allDemos[i].getAttribute("data-exhibit") == exhibitSelected || exhibitSelected == "all";
        let keep = keepArrive[i] && keepDepart[i] && keepExhibit[i];
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

function createDiv(demo) {
    const divElement = document.createElement("div");
    divElement.setAttribute("class", "demo");
    divElement.setAttribute("data-time", transformTimeString(demo.Time));
    divElement.setAttribute("data-exhibit", transformExhibitString(demo.Exhibit));
    return divElement;
}

function createTimeParagraph(demo) {
    const timeParagraph = document.createElement("p");
    timeParagraph.setAttribute("class", "time");
    timeParagraph.textContent = demo.Time;
    return timeParagraph;
}

function createExhibitParagraph(demo) {
    const exhibitParagraph = document.createElement("p");
    exhibitParagraph.setAttribute("class", "exhibit");
    const exhibitLink = document.createElement("a");
    exhibitLink.setAttribute(
        "href",
        "https://nationalzoo.si.edu/animals/exhibits/" + transformExhibitString(demo.Exhibit)
    );
    exhibitLink.setAttribute("target", "_blank");
    exhibitLink.textContent = demo.Exhibit.toUpperCase();
    exhibitParagraph.appendChild(exhibitLink);
    return exhibitParagraph;
}

function createDescriptionParagraph(demo) {
    const descriptionParagraph = document.createElement("p");
    descriptionParagraph.setAttribute("class", "description");
    descriptionParagraph.textContent = demo.Demo;
    return descriptionParagraph;
}

function initializeKeeps() {
    const totalDemos = getDemos().length;
    keepExhibit = new Array(totalDemos).fill(true);
    keepArrive = new Array(totalDemos).fill(true);
    keepDepart = new Array(totalDemos).fill(true);
}

function transformTimeString(timeString) {
    return timeString.replace(/(\d+):(\d+) (AM|PM)/, (_, h, m, p) => `${String(p === 'PM' ? +h + 12 : h).padStart(2, '0')}:${m}`);
}

function transformExhibitString(exhibitString) {
    return exhibitString.toLowerCase().replaceAll(" &amp; ", "").replaceAll("&#039;", "").replaceAll(" & ", "-").replaceAll(" ", "-").replaceAll("'", "");
}

function transformAnimalString(animalString) {
    return animalString.toUpperCase().replaceAll("&amp;", "&").replaceAll("&#039;", "'");
}

function getAnimalUrl(animal) {
    let url = "https://nationalzoo.si.edu/animals/" + animal.toLowerCase().replaceAll("'", "").replaceAll(" ", "-");
    return url;
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