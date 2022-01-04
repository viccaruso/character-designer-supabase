import { 
    checkAuth, 
    getCharacter,
    logout, 
    createCharacter,
    updateCharacter
} from '../fetch-utils.js';

checkAuth();

const headDropdown = document.getElementById('head-dropdown');
const middleDropdown = document.getElementById('middle-dropdown');
const bottomDropdown = document.getElementById('bottom-dropdown');
const headEl = document.getElementById('head');
const middleEl = document.getElementById('middle');
const bottomEl = document.getElementById('bottom');
const reportEl = document.getElementById('report');
const catchphrasesEl = document.getElementById('catchphrases');
const catchphraseInput = document.getElementById('catchphrase-input');
const catchphraseButton = document.getElementById('catchphrase-button');
const logoutButton = document.getElementById('logout');

// we're still keeping track of 'this session' clicks, so we keep these lets
let headCount = 0;
let middleCount = 0;
let bottomCount = 0;
let catchphrases = [];

headDropdown.addEventListener('change', async() => {
    // increment the correct count in state
    headCount++;
    // update the head in supabase with the correct data
    await updateCharacter('head', headDropdown.value);
    
    refreshData();
});


middleDropdown.addEventListener('change', async() => {
    // increment the correct count in state
    middleCount++;
    // update the middle in supabase with the correct data
    await updateCharacter('middle', middleDropdown.value);
    refreshData();
});


bottomDropdown.addEventListener('change', async() => {
    // increment the correct count in state
    bottomCount++;
    // update the bottom in supabase with the correct data
    await updateCharacter('bottom', bottomDropdown.value);
    refreshData();
});

catchphraseButton.addEventListener('click', async() => {
    // go fetch the old catch phrases
    let character = await getCharacter();
    catchphrases = character.catchphrases;
    // update the catchphrases array locally by pushing the new catchphrase into the old array
    catchphrases.push(catchphraseInput.value);
    // update the catchphrases in supabase by passing the mutated array to the updateCatchphrases function
    await updateCharacter('catchphrases', catchphrases);
    refreshData();
    // clear catchphrase input field
    catchphraseInput.value = '';
});

window.addEventListener('load', async() => {
    // on load, attempt to fetch this user's character
    let character = await getCharacter();
    // if this user turns out not to have a character
    if (!character) {
        // create a new character with correct defaults for all properties (head, middle, bottom, catchphrases)
        const defaultCharacter = {
            head: 'bird',
            middle: 'blue',
            bottom: 'leg',
            catchphrases: [],
        };

        character = await createCharacter(defaultCharacter);
    } 
    // and put the character's catchphrases in state (we'll need to hold onto them for an interesting reason);
    catchphrases = character.catchphrases;
    // then call the refreshData function to set the DOM with the updated data
    refreshData();
});

logoutButton.addEventListener('click', () => {
    logout();
});

function displayStats() {
    reportEl.textContent = `In this session, you have changed the head ${headCount} times, the body ${middleCount} times, and the pants ${bottomCount} times. And nobody can forget your character's classic catchphrases:`;
}



async function fetchAndDisplayCharacter() {
    // fetch the character from supabase
    const character = await getCharacter();
    // if the character has a head, display the head in the dom
    if (character.head) {
        headEl.style.backgroundImage = `url(../assets/${character.head}-head.png)`;
    }
    // if the character has a middle, display the middle in the dom
    if (character.middle) {
        middleEl.style.backgroundImage = `url(../assets/${character.middle}-middle.png)`;
    }
    // if the character has a pants, display the pants in the dom
    if (character.bottom) {
        bottomEl.style.backgroundImage = `url(../assets/${character.bottom}-pants.png)`;
    }
    // loop through catchphrases and display them to the dom (clearing out old dom if necessary)
    while (catchphrasesEl.firstChild) {
        catchphrasesEl.firstChild.remove();
    }
    for (let catchphrase of character.catchphrases) {
        const p = document.createElement('p');
        p.textContent = catchphrase;
        catchphrasesEl.append(p);
    }
}

function refreshData() {
    displayStats();
    fetchAndDisplayCharacter();
}
 