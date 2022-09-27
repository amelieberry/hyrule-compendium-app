let botwRepository = (function () {
    let hyruleCompendium = [];
    let apiUrl = 'https://botw-compendium.herokuapp.com/api/v2';
    let modalContainer = document.querySelector('#modal-container');

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
            const equipment = fetched.equipment;
            const materials = fetched.materials;
            const monsters = fetched.monsters;
            const treasure = fetched.treasure;
            const foodCreatures = fetched.creatures.food;
            const nonFoodCreatures = fetched.creatures.non_food;

            const categories = [...equipment, ...materials, ...monsters, ...foodCreatures, ...nonFoodCreatures, ...treasure];
            categories.sort((a, b) => a.id - b.id);
            categories.forEach(category => {
                add(category);
            })
        }).catch(function (e) {
            hideLoadingMessage();
            console.error(e);
        });
    }

    // fetch additional details for a specified entry
    function loadDetails(id) {
        const detailedApiUrl = apiUrl + "/entry/" + id;
        return fetch(detailedApiUrl).then(function (response) {
            return response.json();
        });
    }

    // list entry details
    function showDetails(entry) {
        loadDetails(entry.id).then(function () {
            // first remove all content from modal container

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
            entryDescription.innerHTML = `<h3>Description</h3><p>${entry.description}</p>`;

            // add common locations
            let entryLocations = document.createElement('div');
            entryLocations.innerHTML = `<h3>Common Locations</h3><p>${entry.common_locations}</p>`;

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
        }).catch(function (e) {
            console.error(e);
        });
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


    return {
        getAll: getAll,
        add: add,
        addListItem: addListItem,
        loadList: loadList,
        loadDetails: loadDetails,
        showDetails: showDetails
    }
})();

botwRepository.loadList().then(function () {
    // triggers addListItem on load for each entry object
    botwRepository.getAll().forEach(function (entry) {
        botwRepository.addListItem(entry);
    });
});


