/******* GLOBAL CONSTANTS *******/
const MENU_STATE = 0;
const CLUB_PAGE_STATE = 1;
// Menu page locations. Change these to point to the first page of each section.
const PAGE_MAPPING = ["home", "toc", "toc-2", "saved-clubs", "technology", "hobbies", "cultural", "academic", "creativity", "sports", "search"];
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
var savedClubsList = [];
var joinTarget;
var activePage;


/******* INITIALIZATION *******/
window.addEventListener('load', function () {
    console.log("The webpage has loaded, start initialization.");

    // Setup the join button followup dialogue box listeners. It should disable all events behind it.
    overlayBoxInit();
    for (slider of document.getElementById("club-page-list").getElementsByClassName("slideshow-container")){
        slider.children[0].style.display = "block";
    }
    document.getElementById("gallery-background").getElementsByClassName("slideshow-container")[0].children[0].style.display = "block";
    document.getElementById("gallery-background").getElementsByClassName("slideshow-container")[0].children[0].classList.add("active");
    
    $("#book-frame").turn({ display: "single",}); // Initialize turn.js
    
    initMenuPages(); // Add the menu pages
    bookState = MENU_STATE;
    
    // Activate the home tab
    activeTab = null;
    tabClick("home");
    activateTab("home");
    activateListeners();

    this.document.getElementsByClassName("book-container")[0].getElementsByClassName("home-page")[0].getElementsByClassName("right-fold")[0].hidden = false;
})

// Slideshow content
let slideIndex = [1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,4,5,6];
/* Class the members of each slideshow group with different CSS classes */
let slideId = ["mySlides1", "mySlides2", "mySlides3", "mySlides4", "mySlides5", "mySlides6", "mySlides7", "mySlides8", "mySlides9", "mySlides10", "mySlides11", "mySlides12", "mySlides13", "mySlides14",
                "mySlides15", "mySlides16", "mySlides17", "mySlides18", "mySlides19", "mySlides20", "mySlides21", "mySlides22", "mySlides23", "mySlides24", "mySlides25", "mySlides26", "mySlides27", "mySlides28",
                "mySlides29", "mySlides30", "mySlides31", "mySlides32", "mySlides33", "mySlides34", "mySlides35", "mySlides36", "mySlides37", "mySlides38", "mySlides39", "mySlides40", "mySlides41", "mySlides42",
                "mySlides43"
]

function plusSlides(n, no, gallery) {
    showSlides(slideIndex[no] += n, no, gallery);
}

function showSlides(n, no, gallery) {
    let i;
    if (gallery) {
        let gallerySlideshow = document.getElementById("gallery-background").getElementsByClassName(slideId[no]);
        if (n > gallerySlideshow.length) {slideIndex[no] = 1}
        if (n < 1) {slideIndex[no] = gallerySlideshow.length}
        for (i = 0; i < gallerySlideshow.length; i++) {
            gallerySlideshow[i].style.display = "none";
            if (gallerySlideshow[i].classList.contains("active")) {
                gallerySlideshow[i].classList.remove("active")
            }
        }
        gallerySlideshow[slideIndex[no]-1].style.display = "block";
        gallerySlideshow[slideIndex[no]-1].classList.add("active");
    }
    else {
        let activePageSlideshow = document.getElementsByClassName("book-container")[0].getElementsByClassName(slideId[no]);
        let templatePageSlideshow = document.getElementById("club-page-list").getElementsByClassName(slideId[no]);
        if (n > activePageSlideshow.length) {slideIndex[no] = 1}
        if (n < 1) {slideIndex[no] = activePageSlideshow.length}
        for (i = 0; i < activePageSlideshow.length; i++) {
            activePageSlideshow[i].style.display = "none";
            templatePageSlideshow[i].style.display = "none";
        }
        activePageSlideshow[slideIndex[no]-1].style.display = "block";
        templatePageSlideshow[slideIndex[no]-1].style.display = "block";
    }

} 


/******* FUNCTIONS *******/

// joinFollowupInit() 
function overlayBoxInit() {
    $("#join-followup-background").bind("hover mousedown mousemove mouseup touchstart touchmove touchend", function(event) {
        event.stopPropagation();
    });
    $("#leave-followup-background").bind("hover mousedown mousemove mouseup touchstart touchmove touchend", function(event) {
        event.stopPropagation();
    });
    $("#error-background").bind("hover mousedown mousemove mouseup touchstart touchmove touchend", function(event) {
        event.stopPropagation();
    });
    $("#gallery-background").bind("hover mousedown mousemove mouseup touchstart touchmove touchend", function(event) {
        event.stopPropagation();
    });
}

// initMenuPages()
// Call this to set the book to the menu pages.
// You will need to flip to the right page yourself.
function initMenuPages() {
    bookState = MENU_STATE;
    onePageRemaining = removeAllButOnePage();
    var pages = document.getElementById("menu-pages");
    for (const child of pages.children) {
        var clonedNode = child.cloneNode(true);
        $("#book-frame").turn("addPage", clonedNode);
        if (child.classList.contains("search-page")) {
            $("#book-frame").turn("page", PAGE_MAPPING.indexOf("search")+1);
            initFilters();
            addEventListener("input", search)
            console.log("adding filter listeners");
        }
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
    var clonedClubPageList = [];
    for (const child of clubPageList) {
        clonedClubPageList.push(child.cloneNode(true));
    }
    clonedClubPageList[0].getElementsByClassName("left-fold")[0].classList.add("no-fold");
    clonedClubPageList[clonedClubPageList.length - 1].getElementsByClassName("right-fold")[0].classList.add("no-fold");
    for (const child of clonedClubPageList) {
        $("#book-frame").turn("addPage", child);
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
    $('#book-frame').on('turning', turningEvent);

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
        stars = document.querySelectorAll('[page="' + pages + '"]')[0].getElementsByClassName("radio-btn");
        for (star of stars) {
            if (star.classList.contains("saved")) {
                star.checked = true;
            }
        }
    }
    else {
        if (pages[0] < PAGE_MAPPING.length) {
            activateTab(PAGE_MAPPING[ pages[0] -1 ]);
        }
        else {
            activateTab(PAGE_MAPPING[ PAGE_MAPPING.length - 1 ]);
        }
        /*
        if (PAGE_MAPPING[ pages[0] - 1 ] === "search") {
            initFilters();
        }*/
    }
    // Static fold icon

    activePage = document.querySelectorAll('[page="' + pages + '"]')[0];
    if (!activePage.getElementsByClassName("left-fold")[0].classList.contains("no-fold")) {
        activePage.getElementsByClassName("left-fold")[0].hidden = false;
    }
    if (!activePage.getElementsByClassName("right-fold")[0].classList.contains("no-fold")) {
        activePage.getElementsByClassName("right-fold")[0].hidden = false;
    }
}

function turningEvent() {
    var pages = $('#book-frame').turn('view'); 
    activePage = document.querySelectorAll('[page="' + pages + '"]')[0];
    activePage.getElementsByClassName("left-fold")[0].hidden = true;
    activePage.getElementsByClassName("right-fold")[0].hidden = true;
}

// activateTab(tab)
// tab: String id of the tab that needs to be activated.
// activateTab will remove the id="active" from the previously activated tab,
///     and add the id="active" to the newly selected tab.
// activateTab(null) will make all tabs inactive
// This function is automatically called on a turn.js page flip event.
function activateTab(tab) {
    if (tab === "toc-2") {
        tab = "toc";
    }
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
        clubButtonClick(event);
    }
    else if (event.target.classList[1] === "toc-button") {
        clubButtonClick(event);
    }
    else if (event.target.classList[1] === "save-button") {
        saveButtonClick(event);
    }
    else if (event.target.classList[1] === "join-button") {
        joinTarget = event.target.closest(".club-page");
        if (event.target.classList.contains("joined")) {
            document.getElementById("leave-followup-background").hidden = false;
        }
        else {
            joinButtonClick();
        }
    }
    else if (event.target.classList[1] === "join-cancel") {
        joinTarget = null;
        joinCancelButtonClick();

    }
    else if (event.target.classList[1] === "join-submit") {
        joinSubmitButtonClick(event);
    }
    else if (event.target.classList[1] === "leave-no") {
        joinTarget = null;
        document.getElementById("leave-followup-background").hidden = true;
    }
    else if (event.target.classList[1] === "error-ok") {
        joinTarget = null;
        document.getElementById("error-background").hidden = true;
    }
    else if (event.target.classList[1] === "leave-yes") {
        joinTarget.getElementsByClassName("join-button")[0].textContent = "JOIN";
        joinTarget.getElementsByClassName("join-button")[0].classList.remove("joined");
        document.getElementById("leave-followup-background").hidden = true;
        for (page of document.getElementById("club-page-list").children) {
            if (page.getElementsByClassName("club-name")[0].textContent === joinTarget.getElementsByClassName("club-name")[0].textContent) {
                page.getElementsByClassName("join-button")[0].textContent = "JOIN";
                page.getElementsByClassName("join-button")[0].classList.remove("joined");
            }
        }
    }
    else if (event.target.classList[1] === "button-submit-review") {
        submitReviewButtonClick(event);
    }
    else if (event.target.classList[1] === "photo-cell") {
        var n;
        switch (event.target.classList[2]){
            case "image-1": n = 0; break;
            case "image-2": n = 1; break;
            case "image-3": n = 2; break;
            case "image-4": n = 3; break;
            case "image-5": n = 4; break;
            case "image-6": n = 5; break;
        }
        document.getElementById("gallery-background").hidden = false;

        console.log(document.getElementById("gallery-background").getElementsByClassName("active")[0].classList[2]);
        console.log(event.target.classList[2]);
        gallerySlideshow = document.getElementById("gallery-background").getElementsByClassName(slideId[42]);
        while (!document.getElementById("gallery-background").getElementsByClassName("active")[0].classList.contains(event.target.classList[2])) {
            console.log(document.getElementById("gallery-background").getElementsByClassName("active")[0].classList);
            console.log(document.getElementById("gallery-background").getElementsByClassName("active")[0].classList.contains(event.target.classList[2]));
            plusSlides(1, 42, true);
        }
    }
}

function exitGalleryButton() {
    document.getElementById("gallery-background").hidden = true;
}



function submitReviewButtonClick(event) {
    var clubPage = event.target.closest(".club-page");
    var clubName = clubPage.getElementsByClassName("club-name")[0].textContent;
    var clubPageTemplate;
    fieldsFilled = true;


    for (page of document.getElementById("club-page-list").children) {
        if (page.getElementsByClassName("club-name")[0].textContent === clubName) {
            clubPageTemplate = page;
            break;
        }
    }
    clubPageTemplate.getElementsByClassName("review-textarea")[0].value = clubPage.getElementsByClassName("review-textarea")[0].value;
    clubPageTemplate.getElementsByClassName("review-input-name")[0].value = clubPage.getElementsByClassName("review-input-name")[0].value;
    clubPageStars = clubPage.getElementsByClassName("radio-btn");
    templateStars = clubPageTemplate.getElementsByClassName("radio-btn");
    for (var i = 0; i < 5; i++) {
        if (clubPageStars[i].checked) {
            clubPageStars[i].classList.add("saved");
            templateStars[i].classList.add("saved");
        }
    }
    clubPageTemplate.getElementsByClassName("submit-review-notice")[0].classList.add("success");
    clubPage.getElementsByClassName("submit-review-notice")[0].classList.add("success");
    if (clubPage.getElementsByClassName("button-submit-review")[0].textContent === "Update") {
        clubPage.getElementsByClassName("submit-review-notice")[0].classList.remove("success");
        setTimeout(function(){ 
            clubPage.getElementsByClassName("submit-review-notice")[0].textContent = "Review updated.";
            clubPage.getElementsByClassName("submit-review-notice")[0].classList.add("success"); 
        }, 30);
    }
    for (activeStar of clubPage.getElementsByClassName("radio-btn")) {
        if (activeStar.checked) {
            for (templateStar of clubPageTemplate.getElementsByClassName("radio-btn")) {
                if (templateStar.value === activeStar.value) {
                    templateStar.classList.add("saved");
                }
            }
        }
        else {
            for (templateStar of clubPageTemplate.getElementsByClassName("radio-btn")) {
                if (templateStar.value === activeStar.value && templateStar.classList.contains("saved")) {
                    templateStar.classList.remove("saved");
                }
            }
        }
    }
    clubPageTemplate.getElementsByClassName("button-submit-review")[0].textContent = "Update";
    clubPage.getElementsByClassName("button-submit-review")[0].textContent = "Update";
}

// joinButtonClick() 
// The join button on the club page has been clicked
function joinButtonClick() {
    document.getElementById("join-followup-background").hidden = false;
    for (field of document.getElementById("join-followup-background").getElementsByClassName("num-req")) {
        field.placeholder = "";
    }
}

// joinCancelButtonClick(event)
// The submit button has been pressed on the join club followup dialogue screen.
function joinCancelButtonClick() {
    console.log("cancel buttoned");
    joinTarget = "";
    for (star of document.getElementsByClassName("red-star")) {
        if (star.hidden === false) {
            star.hidden = true;
        }
    }
    for (inputField of document.getElementsByClassName("join-input")) {
        inputField.value = "";
    }
    document.getElementsByClassName("join-select")[0].value = "";
    document.getElementsByClassName("join-textarea")[0].value = "";
    document.getElementById("join-followup-background").hidden = true;
}

// joinSubmitButtonClick()
// The submit button has been pressed on the join club followup dialogue screen.
function joinSubmitButtonClick(event) {
    var fieldsFilled = true;
    for (var inputField of document.getElementsByClassName("join-input")) {
        console.log(inputField.value);
        if (inputField.value === "") {
            fieldsFilled = false;
            for (star of document.getElementsByClassName("red-star")) {
                if (star.classList[1] === inputField.classList[1]) {
                    star.hidden = false;
                }
            }
        }
        else {
            for (star of document.getElementsByClassName("red-star")) {
                if (star.classList[1] === inputField.classList[1]) {
                    star.hidden = true;
                }
            }
            if (inputField.classList.contains("num-req") && !/^\d+$/.test(inputField.value)) {
                fieldsFilled = false;
                inputField.value = "";
                inputField.placeholder = "You must enter a valid number";
                for (star of document.getElementsByClassName("red-star")) {
                    if (star.classList[1] === inputField.classList[1]) {
                        star.hidden = false;
                    }
                }
            }
        }
    }
    var selectField = document.getElementsByClassName("join-select")[0];
    if (selectField.value === "") {
        fieldsFilled = false;
        for (star of document.getElementsByClassName("red-star")) {
            if (star.classList[1] === selectField.classList[1]) {
                star.hidden = false;
            }
        }
    }
    else {
        for (star of document.getElementsByClassName("red-star")) {
            if (star.classList[1] === selectField.classList[1]) {
                star.hidden = true;
            }
        }
    }
    var textareaField = document.getElementsByClassName("join-textarea")[0];
    if (textareaField.value === "") {
        fieldsFilled = false;
        for (star of document.getElementsByClassName("red-star")) {
            if (star.classList[1] === textareaField.classList[1]) {
                star.hidden = false;
            }
        }
    }
    else {
        for (star of document.getElementsByClassName("red-star")) {
            if (star.classList[1] === textareaField.classList[1]) {
                star.hidden = true;
            }
        }
    }

    if (fieldsFilled) {
        joinTarget.getElementsByClassName("join-button")[0].textContent = "JOINED";
        joinTarget.getElementsByClassName("join-button")[0].classList.add("joined");
        for (page of document.getElementById("club-page-list").children) {
            if (page.getElementsByClassName("club-name")[0].textContent === joinTarget.getElementsByClassName("club-name")[0].textContent) {
                page.getElementsByClassName("join-button")[0].textContent = "JOINED";
                page.getElementsByClassName("join-button")[0].classList.add("joined");
            }
        }
        joinCancelButtonClick();
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

// saveButtonClick(clubName)
// A club button has been clicked.
function saveButtonClick(event) {
    var sticker;
    var stickerList;
    var page;
    var clubName = event.target.closest(".half-page").getElementsByClassName("club-name")[0].textContent;
    var saved = event.target.closest(".half-page").getElementsByClassName("club-name")[0].classList.contains("saved");
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
        stickerList = document.getElementsByClassName("saved-clubs-page")[0].getElementsByClassName("club-button");
        for (sticker of stickerList) {
            if (sticker.getElementsByClassName("club-name")[0].textContent === clubName) {
                sticker.parentNode.removeChild(sticker);
                break;
            }
        }
        activeClubPage.getElementsByClassName("save-button")[0].classList.remove("saved");
        clubPageTemplate.getElementsByClassName("save-button")[0].classList.remove("saved");
        event.target.textContent = "SAVE";
        clubPageTemplate.getElementsByClassName("save-button")[0].textContent = "SAVE";
    }
    else {
        stickerList = document.getElementById("club-stickers-list").getElementsByClassName("club-button");
        for (sticker of stickerList) {
            console.log(sticker);
            if (sticker.getElementsByClassName("club-name")[0].textContent === clubName) {
                addClubSticker( document.getElementsByClassName("saved-clubs-page")[0], sticker.cloneNode(true) );
                if( addClubSticker( document.getElementsByClassName("saved-clubs-page")[0].getElementsByClassName("half-page")[0], sticker.cloneNode(true), 3)
                        || addClubSticker( document.getElementsByClassName("saved-clubs-page")[0].getElementsByClassName("half-page")[1], sticker.cloneNode(true), 4)) {
                    activeClubPage.getElementsByClassName("save-button")[0].classList.add("saved");
                    clubPageTemplate.getElementsByClassName("save-button")[0].classList.add("saved");
                    activeClubPage.getElementsByClassName("save-button")[0].textContent = "SAVED";
                    clubPageTemplate.getElementsByClassName("save-button")[0].textContent = "SAVED";
                    break;
                }
                else {
                    document.getElementById("error-background").hidden = false;
                }
            }
        }
    }
}

function search(event) {
    var searchBarContent = event.target.value;
    var resultsStickersList = [];
    var sticker;
    var allPagesList = document.getElementById("club-page-list").getElementsByClassName("club-page");
    var allStickersList = document.getElementById("club-stickers-list").getElementsByClassName("club-button");
    var searchButton = event.target;
    var resultsPage = searchButton.closest('.search-page').getElementsByClassName("results-page")[0];
    var searchPageTemplate = document.getElementById("menu-pages");
    // Remove any prior results
    if (resultsPage.getElementsByClassName("club-button").length > 0) {
        resultsPage.textContent = "";
    }
    if (searchPageTemplate.getElementsByClassName("results-page")[0].getElementsByClassName("club-button").length > 0) {
        searchPageTemplate.getElementsByClassName("results-page")[0].textContent = "";
    }
    // Find pages that match the results, then find the corresponding sticker
    for (var page of allPagesList) {
        pageName = page.getElementsByClassName("club-name")[0].textContent;
        if (searchBarContent !== "" && pageName.toLowerCase().includes(searchBarContent.toLowerCase())) {
            for (sticker of allStickersList) {
                if (sticker.getElementsByClassName("club-name")[0].textContent === pageName) {
                    resultsStickersList.push(sticker);
                    console.log(sticker);
                }
            }
        }
    }
    // Add sticker to results page (for now limited to 3)
    for (sticker of resultsStickersList) {
        addClubSticker(resultsPage, sticker.cloneNode(true), 4);
        addClubSticker(searchPageTemplate.getElementsByClassName("results-page")[0], sticker.cloneNode(true), 4);
    }
    searchPageTemplate.getElementsByClassName("search-bar")[0].value = searchBarContent;
}

// addClubSticker(page, sticker)
// page: element of the page that we will add the sticker to
// sticker: element of the sticker that we will add
// maxStickers: number of stickers that can be fit onto this page.
// returns true if a sticker was added successfully
function addClubSticker(page, sticker, maxStickers) {
    var added = false;
    var numberOfStickers = page.getElementsByClassName("club-button").length;
    if (numberOfStickers < maxStickers) {
        page.appendChild(sticker);
        added = true;
    }
    return added;
}

// tocButtonClick(event)
function tocButtonClick(event) {
    var clubName = event.target.textContent;
    clubPageList = document.getElementById("club-page-list").children;
    // Remove the menu pages and add the list of club pages to the book.
    initClubPages(clubPageList);
    // Find the page number of the club that the user selected. Flip to that club page.
    for (i = 0; i < clubPageList.length; i++) {
        console.log(clubPageList[i].getElementsByClassName("club-name")[0].textContent);
        if (clubPageList[i].getElementsByClassName("club-name")[0].textContent === clubName) {
            $("#book-frame").turn("page", i+1);
            num = i + 1;
            break;
        }
    }
}

// clubButtonClick(event)
// A club button has been clicked.
function clubButtonClick(event) {
    var clubPageList;
    var clubName;
    // The active tab will tell us where the club button was pressed.
    if (activeTab === "search") {
        clubPageList = [];
        for (sticker of document.getElementsByClassName("search-page")[0].getElementsByClassName("club-button")) {
            for (club of document.getElementById("club-page-list").children) {
                if (club.getElementsByClassName("club-name")[0].textContent === sticker.getElementsByClassName("club-name")[0].textContent) {
                    clubPageList.push(club);
                }
            }
        }
        clubName = event.target.getElementsByClassName("club-name")[0].textContent;
    }
    else if (activeTab === "toc") {
        clubPageList = document.getElementById("club-page-list").children;
        clubName = event.target.textContent;
    }
    else if (activeTab === "saved-clubs") {
        clubPageList = [];
        for (sticker of document.getElementsByClassName("saved-clubs-page")[0].getElementsByClassName("club-button")) {
            for (club of document.getElementById("club-page-list").children) {
                if (club.getElementsByClassName("club-name")[0].textContent === sticker.getElementsByClassName("club-name")[0].textContent) {
                    clubPageList.push(club);
                }
            }
        }
        clubName = event.target.getElementsByClassName("club-name")[0].textContent;
    }
    else {
        // Generate a list of clubs corresponding to the current category.
        clubName = event.target.getElementsByClassName("club-name")[0].textContent;
        clubPageList = document.getElementById("club-page-list").getElementsByClassName(activeTab);
    }
    // Remove the menu pages and add the list of club pages to the book.
    initClubPages(clubPageList);
    // Find the page number of the club that the user selected. Flip to that club page.
    for (i = 0; i < clubPageList.length; i++) {
        console.log(clubPageList[i].getElementsByClassName("club-name")[0].textContent);
        if (clubPageList[i].getElementsByClassName("club-name")[0].textContent === clubName) {
            $("#book-frame").turn("page", i+1);
            num = i + 1;
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
                if (document.getElementsByClassName("book-container")[0].getElementsByClassName("selected-container")[0].getElementsByClassName("selected-tag").length === 0) {
                    document.getElementsByClassName("book-container")[0].getElementsByClassName("filter-placeholder")[0].hidden = false;  
                }
            });
            selectedContainer.appendChild(tag);
        }
        document.getElementsByClassName("book-container")[0].getElementsByClassName("filter-placeholder")[0].hidden = true;  
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
