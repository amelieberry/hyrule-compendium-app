let botwRepository = (function () {
    let hyruleCompendium = [];
    let apiUrl = 'https://botw-compendium.herokuapp.com/api/v2';

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
        button.innerHTML =`<img src=${entry.image}></img><p>${entry.id}</p><h2>${entry.name}</h2>`;
        button.classList.add('compendium-button');
        listItem.appendChild(button);
        compendiumList.appendChild(listItem);
        clickEvent(button, entry);
    }
    // list entry details
    function showDetails(entry) {
        loadDetails(entry.id);
    }

    // triggers showDetails on click
    function clickEvent(button, entry) {
        button.addEventListener('click', function () { showDetails(entry) });
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
        showLoadingMessage();
        const detailedApiUrl = apiUrl + "/entry/" + id;
        return fetch(detailedApiUrl).then(function (response) {
            return response.json();
        }).then(function (details) {
            hideLoadingMessage();
            console.log(details.data)
        }).catch(function (e) {
            hideLoadingMessage();
            console.error(e);
        })
    }



    return {
        getAll: getAll,
        add: add,
        addListItem: addListItem,
        loadList: loadList,
        loadDetails: loadDetails,
    }
})();

botwRepository.loadList().then(function () {
    // triggers addListItem on load for each entry object
    botwRepository.getAll().forEach(function (entry) {
        botwRepository.addListItem(entry);
    });
});


