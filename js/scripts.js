let pokemonList = [
    { name: 'Bulbasaur', height: 0.7, types: ['grass', 'poison'] },
    { name: 'Ivysaur', height: 1, types: ['grass', 'poison'] },
    { name: 'Venusaur', height: 2, types: ['grass', 'poison'] },
    { name: 'Charmander', height: 0.6, types: ['fire'] }
];

for (let i = 0; i < pokemonList.length; i++) {
    const container = document.getElementById('compendium-container');
    const typeString = (pokemonList[i].types.length > 1) ? "types: " : "type: ";
    document.write('<div class="compendium-item">' + pokemonList[i].name + '<br>' + 'height: ' + pokemonList[i].height + '<br>' + typeString + pokemonList[i].types.join(' and ') + '<br><br>' + '</div>')
}
