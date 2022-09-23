let pokemonRepository = (function() {
    let pokemonList = [
        { name: 'Bulbasaur', height: 0.7, types: ['grass', 'poison'] },
        { name: 'Ivysaur', height: 1, types: ['grass', 'poison'] },
        { name: 'Venusaur', height: 2, types: ['grass', 'poison'] },
        { name: 'Charmander', height: 0.6, types: ['fire'] }
    ];

    // fetch pokemon array
    function getAll() {
        return pokemonList;
    };

    //add pokemon to array
    function add(item) {
        //Is it an object?
        if (typeof item !== 'object') {
            console.log('Should be an object')
            //Does it include expected keys?
        } else if (!('name' in item) || !('height' in item) || !('types' in item)) {
            console.log('Invalid keys');
        } else {
            pokemonList.push(item);
        }
    }

    return {
        getAll: getAll,
        add: add
    }
})();

// go through array of pokemons and write the values on document
pokemonRepository.getAll().forEach(function(item) {
    let compendiumList = document.querySelector('.compendium-list');
    let listItem = document.createElement('li');
    let button = document.createElement('button');
    button.innerHTML = item.name;
    button.classList.add('compendium-button');
    listItem.appendChild(button);
    compendiumList.appendChild(listItem);

});

