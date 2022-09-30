let botwRepository = (function () {
    let hyruleCompendium = [];
    let apiUrl = 'https://botw-compendium.herokuapp.com/api/v2';
    let modalContainer = document.querySelector('#modal-container');
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
        let compendiumList = document.querySelector('.compendium-list');
        let listItem = document.createElement('li');
        listItem.id = entry.id;
        let button = document.createElement('button');
        button.innerHTML = `<img src=${entry.image}></img><p>${entry.id}</p><h2>${entry.name}</h2>`;
        button.classList.add('compendium-button');

        listItem.appendChild(button);
        compendiumList.appendChild(listItem);
        clickEvent(button, entry);
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

    // list entry details
    function showDetails(entry) {

            //create modal
            let modal = document.createElement('div');
            modal.classList.add('modal');

            // create modal close button
            let closeButton = document.createElement('button');
            closeButton.classList.add('modal-close')
            closeButton.innerText = 'X';
            closeButton.addEventListener('click', hideModal);

            // create modal title
            let entryTitle = document.createElement('h1');
            let entryName = entry.name.toUpperCase();
            entryTitle.innerText = entry.id + '.' + ' ' + entryName;

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

            //add other details that only appear on certain entries

            // append all that stuff
            modal.appendChild(closeButton);
            modal.appendChild(entryTitle);
            modal.appendChild(entryImage);
            modal.appendChild(entryDescription);
            modal.appendChild(entryLocations);
            modalContainer.appendChild(modal);

            // make the modal visible
            modalContainer.classList.add('is-visible');
    }

    // close modal when modalContainer is targeted
    modalContainer.addEventListener('click', (e) => {
        let target = e.target;
        if (target === modalContainer) {
            hideModal();
        }
    });

    function hideModal() {
        modalContainer.classList.remove('is-visible');
        modalContainer.innerHTML = '';
    }

    // triggers showDetails on click
    function clickEvent(button, entry) {
        button.addEventListener('click', function () { showDetails(entry) });
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
            hideModal();
        }
    });

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

    //toggle search bar by pressing the search icon
    let searchButton = $('.search-button');
    let pageTitle = $('.page-title');
    $(document).ready(function(){
        $(searchButton).click(function() {
            pageTitle.toggleClass('d-none d-md-block');
            $('.search-bar').toggleClass('d-none');
            
        });
      });


    //filter compendium items by category
    $('.dropdown').click(function(){
        $('.dropdown-menu').toggleClass('show');
      });


    return {
        getAll: getAll,
        add: add,
        addListItem: addListItem,
        loadList: loadList,
        showDetails: showDetails,
        categories: categories,
    }
})();

botwRepository.loadList().then(function () {
    // triggers addListItem on load for each entry object
    botwRepository.getAll().forEach(function (entry) {
        botwRepository.addListItem(entry);
    });
});


