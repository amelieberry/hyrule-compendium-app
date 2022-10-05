# Hyrule Compendium App
The Hyrule Compendium lists all interactive items on the Sheikah Slate in the game Legend of Zelda Breath of the Wild. With the help of the Guidance Stone, it compiles details about every Creatures, Monsters, Materials, Equipment, and Treasure in the game. To access those details the player must first take a picture of the items and store them on their Sheikah Slate.

This Hyrule Compendium app, on the other hand, uses HTML, CSS and JavaScript to load data from the API ( https://botw-compendium.herokuapp.com/api/v2 ) and allows users to view all compendium entries, without having to venture out to take a picture of an upset Lynel. 

## Styling
The app’s design was inspired by the Compendium in-game. The similar colors and layout provide a familiar feel that will allow users to browse through the app without breaking their in-game immersion. 

## Navigation
Users can scroll through the list of entries and click on each of them to display a modal with further information. Sliders have been added using Bootstrap to allow sliding between modals. Each item on the list is sorted by their in-game ID as they are in the Sheikah Slate’s Compendium to make finding specific items easier.

## Search
The search icon on the right of the nav bar displays a search bar where users can type the name or ID of the entry they are trying to find. As the user types, the app hides any entry that does not match the user input.

## Filter
To filter the list by Category, users can click on the filter icon on the left of the nav bar to toggle a dropdown menu of each category.

## Built with
* HTML, CSS and JavaScript
* Bootstrap
* jQuery

## Live Demo
https://amelieberry.github.io/simple-js-app/
