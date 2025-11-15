/******* GLOBAL CONSTANTS *******/
const MENU_STATE = 0;
const CLUB_PAGE_STATE = 1;
// Menu page locations. Change these to point to the first page of each section.
const HOME_START = 1;
const TOC_START = 2;
const SAVED_CLUBS_START = 3;
const TECHNOLOGY_START = 4;
const HOBBIES_START = 5;
const CULTURAL_START = 6;
const SEARCH_START = 7;


/******* GLOBAL STATE VARIABLES *******/
var activeTab; // Currently active tab, active tab is raised. String of current section ID.
var book_state; // Equal to MENU_STATE or CLUB_PAGE_STATE


/******* INITIALIZATION *******/
window.addEventListener('load', function () {
    console.log("Webpage has loaded");
    
    $("#book-frame").turn({when: {turn: turnEvent}, display: "single",}); // Initialize turn.js
    
    initMenuPages(); // Add the menu pages
    book_state = MENU_STATE;
    
    // Activate the home tab
    activeTab = null;
    tabClick("home");
    activateTab("home");
    activateListeners();
})


/******* FUNCTIONS *******/

// initMenuPages()
// Call this to set the book to the menu pages.
// You will need to flip to the right page yourself.
function initMenuPages() {
    book_state = MENU_STATE;
    removedAPage = removeAllButOnePage();
    var pages = document.getElementById("menu-pages");
    for (const child of pages.children) {
        $("#book-frame").turn("addPage", child.cloneNode(true));
        console.log("Adding page: " + $("#book-frame").turn("pages"));
    }
    if (removedAPage) {
        $("#book-frame").turn("removePage", 1);
    }
    console.log("Finished adding menu pages")
}

// initClubPages(clubPageList)
// clubPageList[] is an array of html elements (club page divs) that need to be added as pages.
// You will need to flip to the right page yourself.
function initClubPages(clubPageList) {
    console.log("initializing club pages");
    book_state = CLUB_PAGE_STATE;
    removedAPage = removeAllButOnePage();
    console.log(clubPageList);
    for (const child of clubPageList) {
        $("#book-frame").turn("addPage", child.cloneNode(true));
        console.log("Adding page: " + $("#book-frame").turn("pages"));
    }
    if (removedAPage) {
        $("#book-frame").turn("removePage", 1);
    }
    console.log("Finished adding club pages");
}

// removeAllButOnePage()
// turn.js does not like you to remove ALL pages.
// This will remove all but one page.
// You will need to remove the remaining page yourself after adding new pages, so that the book isn't left empty.
function removeAllButOnePage() {
    removedAPage = false;
    $("#book-frame").turn("page", 1);
    while ($("#book-frame").turn("pages") > 1) {
        $("#book-frame").turn("removePage", 1);
        removedAPage = true;
    }
    console.log("removed club pages");
    return removedAPage;
}

// activateListeners()
function activateListeners() {
    // Add a click event. We will use this for buttons.
    document.addEventListener( "click", clickEvent );
    // Listener on page turning event.
    $('#book-frame').on('turned', turnEvent);
}

// turnEvent()
// Automatically called when turn.js changes the page view.
// Will activate a tab if the section changes.
function turnEvent() {
    var pages = $('#book-frame').turn('view'); 

    if (book_state === CLUB_PAGE_STATE) {
        // Might do something here later
    }
    // If we are in the MENU_STATE, sequentially compare the active page to the next section until we've a match.
    else if (pages[0] < TOC_START) {
        activateTab("home");
    }
    else if (pages[0] < SAVED_CLUBS_START) {
        activateTab("toc");
    }
    else if (pages[0] < TECHNOLOGY_START) {
        activateTab("saved-clubs");
    }
    else if (pages[0] < HOBBIES_START) {
        activateTab("technology");
    }
    else if (pages[0] < CULTURAL_START) {
        activateTab("hobbies");
    }
    else if (pages[0] < SEARCH_START) {
        activateTab("cultural");
    }
    else {
        activateTab("search");
    }
}

// activateTab(tab)
// tab: String id of the tab that needs to be activated.
// activateTab will remove the id="active" from the previously activated tab,
///     and add the id="active" to the newly selected tab.
// activateTab(null) will make all tabs inactive
// This function is automatically called on a turn.js page flip event.
function activateTab(tab) {
    if (tab === null) {
        // If there is currently an active tab, deactivate it.
        if (activeTab !== null) {
            document.getElementsByClassName(activeTab)[1].removeAttribute( "id", "active");
        }
    }
    else if (activeTab === null) {
        // We are activating a tab. If all tabs are inactive, make this the active one.
        document.getElementsByClassName(tab)[0].setAttribute( "id", "active" );
        activeTab = tab;
    }
    else if (tab !== activeTab) {
        // We are activating a tab. Deactivate the previous tab, and activate the new tab.
        console.log("No changes to active tab");
        document.getElementsByClassName(activeTab)[0].removeAttribute( "id", "active" );
        document.getElementsByClassName(tab)[0].setAttribute( "id", "active");
        activeTab = tab;
    }
}

// clickEvent(event)
// Automatically called when the user clicks.
// We will use this to activate some buttons, tabs, etc.
function clickEvent(event) {
    console.log("click event triggered");
    console.log(event.target.classList[1]);
    if (event.target.classList[1] === "tab") {
        tabClick(event.target.classList[2]);
    }
    else if (event.target.classList[1] === "club-button") {
        console.log(event.target.getElementsByClassName("club-name")[0].textContent);
        clubButtonClick(event.target.getElementsByClassName("club-name")[0].textContent);
    }
}

// tabClick(id)
// Pass the tab name (e.g. "home", "saved-clubs")
// If we are in the MENU_STATE, then jump to the new page and 
function tabClick(tab_name) {
    console.log("starting tabClick");
    pageDestination = 1;
    switch (tab_name) {
        case "home":
            console.log("home");
            pageDestination = HOME_START;
            break;
        case "toc":
            pageDestination = TOC_START;
            break;
        case "saved-clubs":
            pageDestination = SAVED_CLUBS_START;
            break;
        case "technology":
            pageDestination = TECHNOLOGY_START;
            break;
        case "hobbies":
            pageDestination = HOBBIES_START;
            break;
        case "cultural":
            pageDestination = CULTURAL_START;
            break;
        case "search":
            pageDestination = SEARCH_START;
            break;
    }
    if (book_state === CLUB_PAGE_STATE) {
        initMenuPages();
    }
    $("#book-frame").turn("page", pageDestination);
}

// clubButtonClick(clubName)
// clubName: String title of the club (e.g. ".devClub", "The French Club")
// A club button has been clicked.
function clubButtonClick(clubName) {
    var clubPageList;
    // The active tab will tell us where the club button was pressed.
    if (activeTab === "search") {
        // TBD: Generate a list of pages corresponding to the search filters.
    }
    else if (activeTab === "toc") {
        clubPageList = getClubPagesByAlpha();
    }
    else if (activeTab === "saved-clubs") {
        // TBD: Generate a list of saved clubs.
    }
    else {
        // Generate a list of clubs corresponding to the current category.
        clubPageList = getClubPagesByCategory(activeTab);
    }

    // Remove the menu pages and add the list of club pages to the book.
    initClubPages(clubPageList);

    // Find the page number of the club that the user selected. Flip to that club page.
    for (i = 0; i < clubPageList.length; i++) {
        if (clubPageList[i].getElementsByClassName("club-name")[0].textContent === clubName) {
            $("#book-frame").turn("page", i+1);
            break;
        }
    }
}

// getClubPagesByCategory(category)
// category: String id of the club page category (e.g. "technology", "hobbies")
// Return: An array of club pages that match the provided category
function getClubPagesByCategory(category) {
    // Get the div containing all club pages. 
    // Then generate and return a list of any div that contains the "category" as an id.
    return document.getElementById("club-pages").getElementsByClassName(category);
}

// getClubPagesByAlpha()
// Return: An array of club pages in alphabetical order
function getClubPagesByAlpha() {
    // Get the div containing all club pages. 
    // This current implementation relies on the club pages already sorted in alphabetical order.
    return document.getElementById("club-pages").children;
}
