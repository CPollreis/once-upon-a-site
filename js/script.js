// GLOBAL CONSTANTS
const HOME_START = 1;
const TOC_START = 2;
const SAVED_CLUBS_START = 3;
const CATEGORY_1_START = 4;
const CATEGORY_2_START = 5;
const CATEGORY_3_START = 6;
const SEARCH_START = 7;
// GLOBAL VARIABLES
var activeTab; // Active tab is raised



// Start initialization after the html has fully loaded in.
window.addEventListener('load', function () {
    console.log("Webpage has loaded");

    setupListeners();

    // Activate the home tab
    activeTab = null;
    activateTab("home-tab");
})

// Initialization of event listeners.
function setupListeners() {
    console.log("Setting up startup listeners");

    // Tab click listeners.
    let tabs = document.getElementsByClassName("tab");
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].addEventListener("click", function () { tabClick(tabs[i].classList[1]) });
    }

    // Listener on page turning event.
    $('#book-frame').on('turned', turnEvent);
}

// A page turn event has been triggered.
function turnEvent() {
    console.log("Turn event triggered");
    var pages = $('#book-frame').turn('view'); // pages will show as [page1, page2]
    console.log("The two pages visible are: " + pages);

    // Sequentially compare the active page to the next section until we've a match.
    if (pages[0] < TOC_START) {
        activateTab("home-tab");
    }
    else if (pages[0] < SAVED_CLUBS_START) {
        activateTab("toc-tab");
    }
    else if (pages[0] < CATEGORY_1_START) {
        activateTab("saved-clubs-tab");
    }
    else if (pages[0] < CATEGORY_2_START) {
        activateTab("category-1-tab");
    }
    else if (pages[0] < CATEGORY_3_START) {
        activateTab("category-2-tab");
    }
    else if (pages[0] < SEARCH_START) {
        activateTab("category-3-tab");
    }
    else {
        activateTab("search-tab");
    }
}

// activateTab will add/remove the id="active" from the tabs
// activateTab(null) will make all tabs inactive
function activateTab(tab) {
    console.log("Activating new tab");

    if (tab === null) {
        // If there is currently an active tab, inactivate it.
        if (activeTab !== null) {
            document.getElementsByClassName(activeTab)[1].removeAttribute("id", "active");
        }
    }
    else if (activeTab === null) {
        // We are activating a tab. If all tabs are inactive, make this the active one.
        document.getElementsByClassName(tab)[0].setAttribute("id", "active");
        activeTab = tab;
    }
    else if (tab !== activeTab) {
        // We are activating a tab. Inactivate the previous tab, and activate the new tab.
        console.log("No changes to active tab");
        document.getElementsByClassName(activeTab)[0].removeAttribute("id", "active");
        document.getElementsByClassName(tab)[0].setAttribute("id", "active");
        activeTab = tab;
    }
}

// A tab has been clicked on.
function tabClick(id) {
    console.log("starting tabClick");
    switch (id) {
        case "home-tab":
            console.log("home");
            $("#book-frame").turn("page", HOME_START);
            break;
        case "toc-tab":
            $("#book-frame").turn("page", TOC_START);
            break;
        case "saved-clubs-tab":
            $("#book-frame").turn("page", SAVED_CLUBS_START);
            break;
        case "category-1-tab":
            $("#book-frame").turn("page", CATEGORY_1_START);
            break;
        case "category-2-tab":
            $("#book-frame").turn("page", CATEGORY_2_START);
            break;
        case "category-3-tab":
            $("#book-frame").turn("page", CATEGORY_3_START);
            break;
        case "search-tab":
            $("#book-frame").turn("page", SEARCH_START);
            break;
    }
}