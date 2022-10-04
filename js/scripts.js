let botwRepository = (function () {
    let hyruleCompendium = [];
    let apiUrl = 'https://botw-compendium.herokuapp.com/api/v2';
    const categories = [];

    // fetch entry array
    function getAll() {
        return hyruleCompendium;
    };

    //add entry to array
    function add(item) {
        //Is it an object?
        if (typeof item !== 'object') {
            console.log('Should be an object')
            //Does it include expected keys?
        } else if (!('name' in item) || !('image' in item) || !('id' in item)) {
            console.log('Invalid keys');
        } else {
            hyruleCompendium.push(item);
        }
    }
    // create elements for displaying the compendium
    function addListItem(entry) {
        //create lists of each entry
        let compendiumList = document.querySelector('.compendium-list');
        let listItem = document.createElement('li');
        listItem.classList.add('group-list-item', 'd-flex', 'align-items-center', 'justify-content-center')
        listItem.id = entry.id;

        // create a button in each list that holds the image, title and id of the entry.
        let button = document.createElement('button');
        button.innerHTML = `<img class="loading" data-toggle="modal" data-targe="#modal-container" src=${entry.image}></img><p>${entry.id}</p class='text-center'><h2>${entry.name}</h2>`;
        button.classList.add('btn', 'compendium-button', 'd-inline-block', 'text-center');
        button.setAttribute('data-toggle', 'modal');
        button.setAttribute('data-target', '#modal-container');
        listItem.appendChild(button);

        compendiumList.appendChild(listItem);

        clickEvent(button, entry);

        // create carousel item
        let modalCarouselItem = document.createElement('div');
        modalCarouselItem.classList.add('carousel-item');
        modalCarouselItem.id = `carousel-${entry.id}`;

        // create modal header
        let modalHeader = document.createElement('div');
        modalHeader.classList.add('modal-header', 'text-center', 'justify-content-center', 'align-items-center', 'flex-column');

        // create modal close button
        let closeButton = document.createElement('button');
        closeButton.classList.add('modal-close', 'close');
        closeButton.setAttribute('data-dismiss', 'modal');
        closeButton.setAttribute('aria-label', 'close');
        closeButton.innerText = 'X';

        // create modal title
        let entryTitle = document.createElement('h1');
        entryTitle.classList.add('modal-title');
        entryTitle.setAttribute('id', 'modalContainerTitle');
        let entryName = entry.name.toUpperCase();
        entryTitle.innerText = entry.id + '.' + ' ' + entryName;

        //create modalbody 
        let modalBody = document.createElement('div');
        modalBody.classList.add('modal-body');

        // add entry image to modal
        let entryImage = document.createElement('img');
        entryImage.classList.add('modal-image');
        entryImage.alt = `An image of ${entry.name}`;
        entryImage.src = entry.image;

        // add Description of selected entry
        let entryDescription = document.createElement('div');
        entryDescription.innerHTML = `<h3>Description</h3><p class="text-center">${entry.description}</p>`;

        // add common locations
        let entryLocations = document.createElement('div');
        let locations = ''
        if (entry.common_locations === null) {
            locations = "Unknown";
        } else {
            locations = entry.common_locations.join(', ');
        }
        entryLocations.innerHTML = `<h3>Common Locations</h3><p class="text-center">${locations}</p>`;

         // append all that stuff
        modalHeader.appendChild(closeButton);
        modalHeader.appendChild(entryTitle);
        modalBody.appendChild(entryImage);
        modalBody.appendChild(entryDescription);
        modalBody.appendChild(entryLocations);
        modalCarouselItem.appendChild(modalHeader);
        modalCarouselItem.appendChild(modalBody);

        $('.carousel-inner').append(modalCarouselItem);
    }

    // create and append loading message
    function showLoadingMessage() {
        let compendiumList = document.querySelector('.compendium-list');
        let loadingMessage = document.createElement('p');
        loadingMessage.innerHTML = 'Loading, please wait';
        loadingMessage.classList.add('loading-message');
        compendiumList.appendChild(loadingMessage);
    }

    // hide loading message
    function hideLoadingMessage() {
        let compendiumList = document.querySelector('.compendium-list');
        compendiumList.innerHTML = "";
    }

    // fetch data from API, add each specified entry to hyruleCompendium with add()
    function loadList() {
        showLoadingMessage();
        return fetch(apiUrl).then(function (response) {
            return response.json();
        }).then(function (obj) {
            hideLoadingMessage();
            const fetched = obj.data;
            categories.push(...Object.keys(fetched));
            loadCategories();
            const categoriesList = [...categories.map(category => {
                if (category === "creatures") {
                    return [...fetched[category].food, ...fetched[category].non_food]
                } else {
                    return fetched[category]
                }
            })]
            const categoriesObject = categoriesList.flat();
            categoriesObject.sort((a, b) => a.id - b.id);
            categoriesObject.forEach(category => {
                add(category);
            })
        }).catch(function (e) {
            hideLoadingMessage();
            console.error(e);
        });
    }

    // add class active to active modal 
    function showDetails(entry) {
        $('.active').removeClass('active');
        $(`#carousel-${entry.id}`).addClass('active');
    }

    // triggers showDetails on click
    function clickEvent(button, entry) {
        button.addEventListener('click', function () { showDetails(entry) });
    }

    // Search compendium by item name or ID
    let searchValue = document.getElementById('searchBar');

    searchValue.addEventListener('keyup', function (e) {
        let searchString = e.target.value.toLowerCase();

        let itemsToHide = hyruleCompendium.filter(function (item) {
            // FIND ALL THE ITEMS THAT DO NOT CONTAIN SEARCH KEY IN EITHER NAME OR ID
            if (!item.name.toLowerCase().includes(searchString) || !item.id.toString().includes(searchString)) {
                return item
            }
        });
        let itemsToShow = hyruleCompendium.filter(function (item) {
            // FIND ALL THE ITEMS THAT CONTAIN SEARCH KEY IN EITHER NAME OR ID
            if (item.name.toLowerCase().includes(searchString) || item.id.toString().includes(searchString)) {
                return item
            }
        });


        itemsToShow.push(...hyruleCompendium.filter(function (item) {
            return item.id.toString().includes(searchString);
        }))

        itemsToHide.map(item => {
            document.getElementById(item.id).classList.add("hide-item");
        });
        itemsToShow.map(item => {
            document.getElementById(item.id).classList.remove("hide-item");
        })
    });

    //toggle search bar by pressing the search icon. Hide title if small screen
    let searchButton = $('.search-button');
    let pageTitle = $('.page-title');
    $(document).ready(function () {
        $(searchButton).click(function () {
            pageTitle.toggleClass('d-none d-md-block');
            $('.search-bar').toggleClass('d-none');

        });
    });

    // Toggle categories menu by pressing on filter icon
    $('.dropdown').click(function () {
        $('.dropdown-menu').toggleClass('show');
    });

    // show filtered items and hide the rest
    function categoryFilter(category) {
        let showFiltered = [];
        let hideUnfiltered = [];
        if (category === 'all') {
            showFiltered = hyruleCompendium;
        } else {
            hideUnfiltered = hyruleCompendium.filter(function (item) {
                // FIND ALL THE ITEMS THAT DO NOT CONTAIN SEARCH KEY
                if (item.category !== category) {
                    return item
                }
            });

            showFiltered = hyruleCompendium.filter(function (item) {
                // FIND ALL THE ITEMS THAT CONTAIN SEARCH KEY 
                if (item.category === category) {
                    return item
                }
            });
        }

        hideUnfiltered.map(item => {
            document.getElementById(item.id).classList.add("hide-item");
        });
        showFiltered.map(item => {
            document.getElementById(item.id).classList.remove("hide-item");
        })
    }

    // create categories list in dropdown menu
    function loadCategories() {
        $('#category-dropdown').append(`<li class="dropdown-item"><button id="all" onclick="botwRepository.categoryFilter('all')" class="filter-button btn">All Categories</button></li>`)
        categories.forEach(category => (
            $('#category-dropdown').append(`<li class="dropdown-item"><button id="${category}" onclick="botwRepository.categoryFilter('${category}')" class="filter-button btn">${category.charAt(0).toUpperCase() + category.slice(1)}</button></li>`
            )
        ))
    }


    return {
        getAll: getAll,
        add: add,
        addListItem: addListItem,
        loadList: loadList,
        showDetails: showDetails,
        categories: categories,
        categoryFilter: categoryFilter,
        loadCategories: loadCategories
    }
})();

botwRepository.loadList().then(function () {
    // triggers addListItem on load for each entry object
    botwRepository.getAll().forEach(function (entry) {
        botwRepository.addListItem(entry);
    });

});


