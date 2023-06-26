// Declare global keep variables to be used in functions
let keepExhibit;
let keepArrive;
let keepDepart;

// Declare global animal arrays to be used in functions
let animalList = new Array();
let exhibitList = new Array();
let imageList = new Array();

// Get demo and animal data
fetchDemos();
fetchAnimals();

/**
 * Get demo data from demoData.json
 */
function fetchDemos() {
    fetch("demoData.json")
        .then(response => response.json())
        .then(data => {
            data.forEach(demo => addDemoToPage(demo));
            sortByTime();
            initializeKeeps();
            addCollapsibleEventHandlers();
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

/**
 * Get animal data from animalData.json
 */
function fetchAnimals() {
    fetch("animalData.json")
        .then(response => response.json())
        .then(data => {
            data.forEach(animal => {
                if (animal.title && animal.exhibit_name) {
                    animalList.push(transformAnimalString(animal.title));
                    exhibitList.push(transformExhibitString(animal.exhibit_name));
                }
            });
            fetchImages(animalList) // Call fetchImages and handle the resolved imageList
                .then(resolvedImageList => {
                    imageList = resolvedImageList;
                })
                .catch(error => {
                    console.error("Error: ", error);
                });
        })
        .catch(error => {
            console.error("Error: ", error);
        })
}

/**
 * Get animal image data from imageData.json
 */
function fetchImages(animalList) {
    let imageList = new Array(animalList.length);

    return fetch("imageData.json")
        .then(response => response.json())
        .then(data => {
            const dataArray = Object.values(data);
            dataArray.forEach(animal => {
                if (animalList.includes(transformAnimalString(animal.title))) {
                    let index = animalList.indexOf(transformAnimalString(animal.title));
                    imageList[index] = animal.image_small;
                    let indexDuplicate = animalList.indexOf(transformAnimalString(animal.title), index + 1);
                    if (indexDuplicate) imageList[indexDuplicate] = animal.image_small;
                }
            });
            return imageList;
        })
        .catch(error => {
            console.error("Error: ", error)
        })
}

/**
 * Add demos to page
 * @param {Object} demo Object representing a scheduled demo
 */
function addDemoToPage(demo) {
    const divElement = createDiv(demo);
    const timeContainer = createTimeContainer(demo);
    const exhibitContainer = createExhibitContainer(demo);
    const descriptionContainer = createDescriptionContainer(demo);
    const collapsible = createCollapsible();
    const container = document.getElementById("demo-grid");

    divElement.appendChild(timeContainer);
    divElement.appendChild(exhibitContainer);
    divElement.appendChild(collapsible);
    divElement.appendChild(descriptionContainer);
    container.appendChild(divElement);
}

/**
 * Remove all demos occurring before arrival time from display
 */
function changeArrivalTime() {
    let allDemos = getDemos();

    let arrivalTime = getArrivalTime();

    for (let i = 0; i < allDemos.length; i++) {
        let time = allDemos[i].getAttribute("data-time");
        keepArrive[i] = arrivalTime <= time;
        let keep = keepArrive[i] && keepDepart[i] && keepExhibit[i];
        allDemos[i].style.display = keep ? "grid" : "none";
    }
}

/**
 * Remove all demos occurring after departure time from display
 */
function changeDepartureTime() {
    let allDemos = getDemos();

    let departureTime = getDepartureTime();

    for (let i = 0; i < allDemos.length; i++) {
        let time = allDemos[i].getAttribute("data-time");
        keepDepart[i] = departureTime > time;
        let keep = keepArrive[i] && keepDepart[i] && keepExhibit[i];
        allDemos[i].style.display = keep ? "grid" : "none";
    }
}

/**
 * Remove all demos and animals unrelated to the selected exhibit from display
 */
function changeExhibit() {
    let allDemos = getDemos();
    let allAnimals = getAnimals();

    let exhibitSelected = getExhibitSelected();

    for (let i = 0; i < allDemos.length; i++) {
        keepExhibit[i] = allDemos[i].getAttribute("data-exhibit") == exhibitSelected || exhibitSelected == "all";
        let keepDemo = keepArrive[i] && keepDepart[i] && keepExhibit[i];
        allDemos[i].style.display = keepDemo ? "grid" : "none";
    }

    for (let i = 0; i < allAnimals.length; i++) {
        let keepAnimal = allAnimals[i].getAttribute("data-exhibit") == exhibitSelected || exhibitSelected == "all";
        allAnimals[i].style.display = keepAnimal ? "grid" : "none";
    }

    //changePicture(exhibitSelected);
}

/**
 * Sort demo display by scheduled time
 */
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

/**
 * Sort demo display by exhibit
 */
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

/**
 * Add event handlers
 */
function addCollapsibleEventHandlers() {
    let allDemos = Array.from(getDemos());
    let allCollapsibles = Array.from(document.getElementsByClassName("collapsible"));

    for (let i = 0; i < allDemos.length; i++) {
        allCollapsibles[i].addEventListener("click", () => {
            expandDemo(allDemos[i]);
        })
    }
}

function addAnimalEventHandler(slide, animal) {
    let animalLink = document.querySelector(".animal-link");
    slide.addEventListener("mouseover", () => {
        animalLink.textContent = animal;
    })
    slide.addEventListener("mouseout", () => {
        animalLink.textContent = "";
    })
    slide.addEventListener("click", () => {
        window.open(getAnimalUrl(animal), "_blank");
    })
}

/**
 * Expands demo info
 * @param {*} demo Demo div element
 */
function expandDemo(demo) {
    let expanded = (demo.getAttribute("data-expand") === "true");
    closeExpandedDemos();

    if (expanded == false) {
        demo.setAttribute("data-expand", "true");

        createSwiper(demo);

        let collapsible = demo.querySelector("button");
        collapsible.setAttribute("class", "collapsible collapsed");
        demo.style.height = "300px";
    }
}

/**
 * Create div element for demo
 * @param {Object} demo Object representing a scheduled demo
 * @returns div element
 */
function createDiv(demo) {
    const divElement = document.createElement("div");
    divElement.setAttribute("class", "demo");
    divElement.setAttribute("data-expand", "false");
    divElement.setAttribute("data-time", transformTimeString(demo.Time));
    divElement.setAttribute("data-exhibit", transformExhibitString(demo.Exhibit));
    return divElement;
}

/**
 * Create p element for demo time
 * @param {Object} demo Object representing a scheduled demo
 * @returns p element
 */
function createTimeContainer(demo) {
    const timeContainer = document.createElement("div");
    timeContainer.setAttribute("class", "time");
    const timeParagraph = document.createElement("p");
    timeParagraph.textContent = demo.Time;
    timeContainer.appendChild(timeParagraph);
    return timeContainer;
}

/**
 * Create p element for demo exhibit and link to page
 * @param {Object} demo Object representing a scheduled demo
 * @returns p element
 */
function createExhibitContainer(demo) {
    const exhibitContainer = document.createElement("div");
    exhibitContainer.setAttribute("class", "exhibit");
    const exhibitParagraph = document.createElement("p");
    const exhibitLink = document.createElement("a");
    exhibitLink.setAttribute(
        "href",
        "https://nationalzoo.si.edu/animals/exhibits/" + transformExhibitString(demo.Exhibit).replace("africa-trail", "cheetah-conservation-station")
    );
    exhibitLink.setAttribute("target", "_blank");
    exhibitLink.textContent = demo.Exhibit.toUpperCase();
    exhibitParagraph.appendChild(exhibitLink);
    exhibitContainer.appendChild(exhibitParagraph);
    return exhibitContainer;
}

/**
 * Create p element for demo description
 * @param {Object} demo Object representing a scheduled demo
 * @returns p element
 */
function createDescriptionContainer(demo) {
    const descriptionContainer = document.createElement("div");
    descriptionContainer.setAttribute("class", "description");
    const descriptionParagraph = document.createElement("p");
    descriptionParagraph.textContent = demo.Demo;
    descriptionContainer.appendChild(descriptionParagraph);
    return descriptionContainer;
}

function createCollapsible() {
    const collapsible = document.createElement("button");
    collapsible.setAttribute("class", "collapsible");
    return collapsible;
}

/**
 * Set initial keep values to true for all demos
 */
function initializeKeeps() {
    const totalDemos = getDemos().length;
    keepExhibit = new Array(totalDemos).fill(true);
    keepArrive = new Array(totalDemos).fill(true);
    keepDepart = new Array(totalDemos).fill(true);
}

/**
 * Format string in 24-hour time
 * @param {string} timeString 
 * @returns Transformed string
 */
function transformTimeString(timeString) {
    return timeString.replace(/(\d+):(\d+) (AM|PM)/, (_, h, m, p) => `${String(p === 'PM' ? +h + 12 : h).padStart(2, '0')}:${m}`);
}

/**
 * Remove special characters, lowercase, and hyphenate string
 * @param {string} exhibitString 
 * @returns Transformed string
 */
function transformExhibitString(exhibitString) {
    return exhibitString.toLowerCase().replaceAll(" (outdoor viewing)", "").replaceAll(" &amp; ", "-").replaceAll("&#039;", "").replaceAll(" & ", "-").replaceAll(" ", "-").replaceAll("'", "");
}

/**
 * Replace shortcuts with special characters and capitalize string
 * @param {string} animalString 
 * @returns Transformed string
 */
function transformAnimalString(animalString) {
    return animalString.toUpperCase().replaceAll("&amp;", "&").replaceAll("&#039;", "'");
}

/**
 * Gets URL of the web page of the animal provided as a parameter
 * @param {string} animal 
 * @returns URL of animal page
 */
function getAnimalUrl(animal) {
    let url = "https://nationalzoo.si.edu/animals/" + animal.toLowerCase().replaceAll("'", "").replaceAll(" ", "-");
    return url;
}

/**
 * Gets all demos on page
 * @returns All demo elements
 */
function getDemos() {
    return document.getElementsByClassName("demo");
}

/**
 * Gets all animals on page
 * @returns All animal elements
 */
function getAnimals() {
    return document.getElementsByClassName("animal");
}

/**
 * Gets value of exhibit selector
 * @returns Value of exhibit selector
 */
function getExhibitSelected() {
    let exhibitSelected = document.getElementById("exhibit-select");
    return exhibitSelected.value;
}

/**
 * Gets value of arrival time
 * @returns Value of arrival time
 */
function getArrivalTime() {
    let arrival = document.getElementById("arrival");
    return arrival.value;
}

/**
 * Gets value of departure time
 * @returns Value of departure time
 */
function getDepartureTime() {
    let departure = document.getElementById("departure");
    return departure.value;
}

/**
 * Changes background image based on the selected exhibit
 * @param {string} exhibitSelected Value of exhibit selector
 */
function changePicture(exhibitSelected) {
    let url = "url('images/" + exhibitSelected + ".jpg')";
    document.body.style.backgroundImage = url;
    document.body.style.backgroundRepeat = "no-repeat";
}

/**
 * Closes all expanded demos
 */
function closeExpandedDemos() {
    let allDemos = Array.from(getDemos());
    allDemos.forEach(eachDemo => {
        eachDemo.setAttribute("data-expand", "false");
        eachDemo.style.height = "50px";
    });
    let collapsibles = Array.from(document.getElementsByClassName("collapsible"));
    collapsibles.forEach(collapsible => { collapsible.setAttribute("class", "collapsible") })
    let containers = Array.from(document.getElementsByClassName("swiper-container"));
    containers.forEach(container => { container.remove() });
}

/**
 * Creates a Swiper slideshow of all animals in the demo's exhibit
 * @param {*} demo Demo div element
 */
function createSwiper(demo) {
    let exhibit = demo.getAttribute("data-exhibit");
    let animals = animalList.slice();
    let images = imageList.slice();

    animals = animals.filter(animal => { return exhibitList[animals.indexOf(animal)] == exhibit; })
    images = images.filter(image => { return exhibitList[images.indexOf(image)] == exhibit; })

    let label = document.createElement("p");
    label.setAttribute("class", "animal-label");
    label.textContent = "Animals in this exhibit: ";

    let container = document.createElement("div");
    container.setAttribute("class", "swiper-container");

    let wrapper = document.createElement("div");
    wrapper.setAttribute("class", "swiper-wrapper");
    for (let i = 0; i < animals.length; i++) {
        let slide = document.createElement("div");
        slide.setAttribute("class", "swiper-slide");
        let image = document.createElement("img");
        image.setAttribute("class", "animal-image");
        image.setAttribute("src", images[i]);
        image.setAttribute("alt", animals[i]);
        slide.appendChild(image);
        wrapper.appendChild(slide);
    }

    let buttonPrev = document.createElement("div");
    buttonPrev.setAttribute("class", "swiper-button-prev");
    let buttonNext = document.createElement("div");
    buttonNext.setAttribute("class", "swiper-button-next");

    let animalDiv = document.createElement("div");
    animalDiv.setAttribute("class", "animal-div");
    let paragraph = document.createElement("p");
    paragraph.textContent = "Animal selected: ";
    let animalText = document.createElement("p");
    animalText.setAttribute("data-exhibit", exhibit);
    let animalLink = document.createElement("a");
    animalLink.setAttribute("class", "animal-link");
    animalText.appendChild(animalLink);
    animalDiv.appendChild(paragraph);
    animalDiv.appendChild(animalText);

    container.appendChild(label);
    container.appendChild(wrapper);
    container.appendChild(buttonPrev);
    container.appendChild(buttonNext);
    container.appendChild(animalDiv);
    demo.appendChild(container);

    let swiper = new Swiper('.swiper-container', {
        slidesPerView: 6,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    let slides = demo.querySelectorAll('.swiper-slide');
    animals.forEach(function (animal, index) {
        addAnimalEventHandler(slides[index], animal);
    });
}