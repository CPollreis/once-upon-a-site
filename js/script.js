/******* GLOBAL CONSTANTS *******/
const MENU_STATE = 0;
const CLUB_PAGE_STATE = 1;
// Menu page locations. Change these to point to the first page of each section.
const PAGE_MAPPING = ["home", "toc", "saved-clubs", "technology", "hobbies", "cultural", "category-4", "category-5", "category-6", "search"];
const HOME_START = 1;
const TOC_START = 2;
const SAVED_CLUBS_START = 3;
const TECHNOLOGY_START = 4;
const HOBBIES_START = 5;
const CULTURAL_START = 6;
const SEARCH_START = 7;


/******* GLOBAL STATE VARIABLES *******/
var activeTab; // Currently active tab, active tab is raised. String of current section ID.
var bookState; // Equal to MENU_STATE or CLUB_PAGE_STATE
var savedCLubsList = [];


/******* INITIALIZATION *******/
window.addEventListener('load', function () {
    console.log("The webpage has loaded, start initialization.")
    
    $("#book-frame").turn({ display: "single",}); // Initialize turn.js
    
    initMenuPages(); // Add the menu pages
    bookState = MENU_STATE;
    
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
    bookState = MENU_STATE;
    onePageRemaining = removeAllButOnePage();
    var pages = document.getElementById("menu-pages");
    for (const child of pages.children) {
        $("#book-frame").turn("addPage", child.cloneNode(true));
        console.log("Adding page: " + $("#book-frame").turn("pages"));
    }
    if (onePageRemaining) {
        $("#book-frame").turn("removePage", 1);
    }
    console.log("Finished adding menu pages")
}

// initClubPages(clubPageList)
// clubPageList[] is an array of html elements (club page divs) that need to be added as pages.
// You will need to flip to the right page yourself.
function initClubPages(clubPageList) {
    console.log("initializing club pages");
    bookState = CLUB_PAGE_STATE;
    onePageRemaining = removeAllButOnePage();
    console.log(clubPageList);
    for (const child of clubPageList) {
        $("#book-frame").turn("addPage", child.cloneNode(true));
        console.log("Adding page: " + $("#book-frame").turn("pages"));
    }
    if (onePageRemaining) {
        $("#book-frame").turn("removePage", 1);
    }
    console.log("Finished adding club pages");
}

// removeAllButOnePage()
// turn.js does not like you to remove ALL pages.
// This will remove all but one page.
// You will need to remove the remaining page yourself after adding new pages, so that the book isn't left empty.
function removeAllButOnePage() {
    onePageRemaining = false;
    $("#book-frame").turn("page", 1);
    while ($("#book-frame").turn("pages") > 1) {
        $("#book-frame").turn("removePage", 1);
        onePageRemaining = true;
    }
    if ($("#book-frame").turn("pages") === 1) {
        onePageRemaining = true;
    }
    console.log("removed club pages");
    return onePageRemaining;
}

// activateListeners()
function activateListeners() {
    // Add a click event. We will use this for buttons.
    document.addEventListener( "click", clickEvent );
    // Listener on page turning event.
    $('#book-frame').on('turned', turnEvent);

    // Update the turn.js divs when the window size changes.
    addEventListener("resize", () => { 
        var container = document.getElementsByClassName("book-container")[0];
        var style = getComputedStyle(container);
        var width = container.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
        var height = container.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
        $('#book-frame').turn('size', width, height);
    })
}

// turnEvent()
// Automatically called when turn.js changes the page view.
// Will activate a tab if the section changes.
function turnEvent() {
    var pages = $('#book-frame').turn('view'); 

    if (bookState === CLUB_PAGE_STATE) {
        // Might do something here later
    }
    else {
        if (pages[0] < PAGE_MAPPING.length) {
            activateTab(PAGE_MAPPING[ pages[0] -1 ]);
        }
        else {
            activateTab(PAGE_MAPPING[ PAGE_MAPPING.length - 1 ]);
        }
        if (PAGE_MAPPING[ PAGE_MAPPING.length - 1 ] === "search") {
            initFilters();
        }
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
        tabClick(event.target.classList[3]);
    }
    else if (event.target.classList[1] === "club-button") {
        console.log(event.target.getElementsByClassName("club-name")[0].textContent);
        clubButtonClick(event);
    }
    else if (event.target.classList[1] === "save-button") {
        saveButtonClick(event);
    }
}

// tabClick(id)
// Pass the tab name (e.g. "home", "saved-clubs")
// If we are in the MENU_STATE, then jump to the new page and 
function tabClick(tabName) {
    console.log("starting tabClick");
    pageDestination = PAGE_MAPPING.indexOf(tabName);
    if (bookState === CLUB_PAGE_STATE) {
        initMenuPages();
    }
    $("#book-frame").turn("page", pageDestination+1);
}

// clubButtonClick(clubName)
// clubName: String title of the club (e.g. ".devClub", "The French Club")
// A club button has been clicked.
function saveButtonClick(event) {
    var sticker;
    var stickerList;
    var page;
    var clubName = event.target.parentElement.getElementsByClassName("club-name")[0].textContent;
    var saved = event.target.parentElement.getElementsByClassName("club-name")[0].classList.contains("saved");
    var activeClubPage = event.target.closest(".club-page");
    var saved = activeClubPage.getElementsByClassName("save-button")[0].classList.contains("saved");
    var clubPageTemplate;
    for (page of document.getElementById("club-page-list").children) {
        if (page.getElementsByClassName("club-name")[0].textContent === clubName) {
            clubPageTemplate = page;
            break;
        }
    }

    if (saved) {
        stickerList = document.getElementById("saved-clubs-page").getElementsByClassName("club-button");
        for (sticker of stickerList) {
            if (sticker.getElementsByClassName("club-name")[0].textContent === clubName) {
                sticker.parentNode.removeChild(sticker);
                break;
            }
        }
        activeClubPage.getElementsByClassName("save-button")[0].classList.remove("saved");
        clubPageTemplate.getElementsByClassName("save-button")[0].classList.remove("saved");
        event.target.textContent = "Save Club";
        clubPageTemplate.getElementsByClassName("save-button")[0].textContent = "Save Club";
    }
    else {
        stickerList = document.getElementById("club-stickers-list").getElementsByClassName("club-button");
        for (sticker of stickerList) {
            console.log(sticker);
            if (sticker.getElementsByClassName("club-name")[0].textContent === clubName) {
                addClubSticker( document.getElementById("saved-clubs-page"), sticker.cloneNode(true) );
                activeClubPage.getElementsByClassName("save-button")[0].classList.add("saved");
                clubPageTemplate.getElementsByClassName("save-button")[0].classList.add("saved");
                activeClubPage.getElementsByClassName("save-button")[0].textContent = "Saved";
                clubPageTemplate.getElementsByClassName("save-button")[0].textContent = "Saved";
                break;
            }
        }
    }
}

// addClubSticker(page, sticker)
// page: element of the page that we will add the sticker to
// sticker: element of the sticker that we will add
// returns true if a sticker was added successfully
function addClubSticker(page, sticker) {
    var numberOfStickers = page.getElementsByClassName("club-button").length;
    if (numberOfStickers < 4) {
        page.getElementsByClassName("half-page")[0].appendChild(sticker);
    }
    else if (numberOfStickers < 8) {
        page.getElementsByClassName("half-page")[1].appendChild(sticker);
    }
}

// clubButtonClick(clubName)
// clubName: String title of the club (e.g. ".devClub", "The French Club")
// A club button has been clicked.
function clubButtonClick(event) {
    var clubPageList;
    var clubName = event.target.getElementsByClassName("club-name")[0].textContent
    // The active tab will tell us where the club button was pressed.
    if (activeTab === "search") {
        // TBD: Generate a list of pages corresponding to the search filters.
    }
    else if (activeTab === "toc") {
        clubPageList = document.getElementById("club-page-list").children;
    }
    else if (activeTab === "saved-clubs") {
        clubPageList = [];
        for (sticker of document.getElementById("saved-clubs-page").getElementsByClassName("club-button")) {
            for (club of document.getElementById("club-page-list").children) {
                if (club.getElementsByClassName("club-name")[0].textContent === sticker.getElementsByClassName("club-name")[0].textContent) {
                    clubPageList.push(club);
                }
            }
        }
    }
    else {
        // Generate a list of clubs corresponding to the current category.
        clubPageList = document.getElementById("club-page-list").getElementsByClassName(activeTab);
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


/******* FILTER FUNCTIONS *******/
var draggingBox;
var choices;
var placeholder;
var selectedContainer;
var filtersContainer;

function initFilters() {
    draggingBox = null;
    choices = document.getElementsByClassName("book-container")[0].getElementsByClassName('draggable-choice');
    placeholder = document.getElementsByClassName("book-container")[0].getElementsByClassName('selected-placeholder')[0];
    selectedContainer = document.getElementsByClassName("book-container")[0].getElementsByClassName('selected-container')[0];
    filtersContainer = document.getElementsByClassName("book-container")[0].getElementsByClassName('filters-container')[0];

    document.querySelectorAll('.filter-header').forEach(header => {
        header.addEventListener('click', (e) => {
            e.stopPropagation();
            const box = header.parentElement;
            var notActive = !box.classList.contains("active");
            for (filterBox of document.getElementsByClassName("book-container")[0].getElementsByClassName("filter-box")) {
                if (filterBox.classList.contains("active")) {
                    filterBox.classList.toggle('active');
                }
            }
            if (notActive)  {
                box.classList.toggle('active');
            }
        });
    });

    filtersContainer.addEventListener('dragstart', e => {
        if (e.target.classList.contains('filter-box')) {
            draggingBox = e.target;
            e.target.classList.add('dragging');
        }
    });

    filtersContainer.addEventListener('dragend', e => {
        e.target.classList.remove('dragging');
        draggingBox = null;
    });

    filtersContainer.addEventListener('dragover', e => {
        e.preventDefault();
        const after = getDragAfter(filtersContainer, e.clientY);
        if (after == null) 
            filtersContainer.appendChild(draggingBox);
        else 
            filtersContainer.insertBefore(draggingBox, after);
    });

    for (choice of choices) {
        choice.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', e.target.textContent);
            e.target.classList.add('being-dragged');
        });
        choice.addEventListener('dragend', e => e.target.classList.remove('being-dragged'));
    };

    placeholder.addEventListener('dragover', e => {
        e.preventDefault();
        placeholder.classList.add('dragover');
    });

    placeholder.addEventListener('dragleave', () => placeholder.classList.remove('dragover'));

    placeholder.addEventListener('drop', e => {
        e.preventDefault();
        placeholder.classList.remove('dragover');
        const text = e.dataTransfer.getData('text/plain');
        if (text) {
            const draggedChoice = document.querySelector('.draggable-choice.being-dragged');
            if (draggedChoice) {
                const filterName = draggedChoice.dataset.filter;
                addSelectedTag(text, filterName);
                draggedChoice.classList.add('removed');
                setTimeout(() => draggedChoice.remove(), 150);
            }
        }
    });

    function getDragAfter(container, y) {
        const boxes = [...container.querySelectorAll('.filter-box:not(.dragging)')];
        return boxes.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            return (offset < 0 && offset > closest.offset) ? { offset, element: child } : closest;
        }, { 
            offset: Number.NEGATIVE_INFINITY 
        }).element;
    }

   // Add tag to selected section
    function addSelectedTag(text, filterName) {
        const existing = [...selectedContainer.children].some(tag => tag.textContent.startsWith(text));
        if (!existing) {
            const tag = document.createElement('div');
            tag.className = 'selected-tag';
            tag.dataset.choice = text;
            tag.dataset.filter = filterName;
            tag.textContent = text;
            tag.addEventListener('click', () => {
                restoreChoice(tag.dataset.choice, tag.dataset.filter);
                tag.remove();
            });
            selectedContainer.appendChild(tag);
        }    
    }

    function restoreChoice(text, filterName) {
        const parentBox = [...document.querySelectorAll('.filter-box')].find(box => box.querySelector('.filter-header').textContent.trim() === filterName);
        if (parentBox) {
            const content = parentBox.querySelector('.filter-content');
            const el = document.createElement('div');
            el.className = 'draggable-choice';
            el.draggable = true;
            el.dataset.filter = filterName;
            el.textContent = text;
            el.addEventListener('dragstart', e => {
                e.dataTransfer.setData('text/plain', e.target.textContent);
                e.target.classList.add('being-dragged');
            });
            el.addEventListener('dragend', e => e.target.classList.remove('being-dragged'));
            content.appendChild(el);
        }
    }
}