const wordEl = document.getElementById('word');
const wrongLettersEl = document.getElementById('wrong-letters');
const playAgainBtn = document.getElementById('play-button');
const popup = document.getElementById('popup-container');
const notification = document.getElementById('notification-container');
const finalMessage = document.getElementById('final-message');



// figure parts

const figureParts = document.querySelectorAll('.figure-part');


// possible words
// const words = ['java', 'python', 'swift', 'javascript', 'ruby'];

// get randomWord 
// let selectedWord = words[Math.floor(Math.random() * words.length)];

let words = [];
// Get randomWord 
let selectedWord = '';

// Fetch the words from the JSON file
fetch('words.json')
    .then(response => response.json())
    .then(data => {
        words = data.words; // Assign the words array from JSON to the words variable
        selectRandomWord(); // Call function to select a random word
    
    displayWord();
    })
   // .catch(error => console.error('Error fetching words:', error));

// Function to select a random word
function selectRandomWord() {
    selectedWord = words[Math.floor(Math.random() * words.length)];
    displayWord(); // Display the initially selected word
}


const correctLetters = [];
const wrongLetters = [];

// show hidden word 
function displayWord() {
    wordEl.innerHTML = `
        ${selectedWord
            .split('') // turns the word into an array of letters
            .map(letter => `
                <span class="letter">
                    ${correctLetters.includes(letter) ? letter : ''} 
                </span>
            `)
            .join('')} 
    `;

    // gets rid of the new line so its all on one line 
    const innerWord = wordEl.innerText.replace(/\n/g, '');

    console.log(wordEl.innerText, innerWord);

    // trigger win 
    if(innerWord === selectedWord){
        finalMessage.innerText = 'Congratulations!';
        popup.style.display = 'flex';
    }

}

    // update Wrong letters
    function updateWrongLettersEl(){
        // add to the array of wrong letters
        wrongLettersEl.innerHTML = `
        ${wrongLetters.length > 0 ? '<p>Wrong</p>' : ''}
        ${wrongLetters.map(letter => `<span>${letter}</span>`)}
        `;

        // add to the body of the hangman
        figureParts.forEach((part, index) => {
            const errors = wrongLetters.length;

            if(index < errors){
                part.style.display = 'block';
            }else{
                part.style.display = 'none';
            }

        });

        // check when the whole figure is built = game lost 
        if(wrongLetters.length == figureParts.length){
            finalMessage.innerText = "You Lost!";
            popup.style.display = 'flex';

        }



    }

    // show class is what displays the pop up
    function showNotification(){
        notification.classList.add('show');

        // wait for 2 seconds 
        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    }


 // keys user presses
window.addEventListener('keydown', e => {
    // Check if the pressed key is a letter between A and Z
    if (e.code >= 'KeyA' && e.code <= 'KeyZ') {
        const letter = e.key.toLowerCase(); // Convert the letter pressed to lowercase

        // Check if the letter is in the selected word (convert selectedWord to lowercase)
        if (selectedWord.toLowerCase().includes(letter)) {
            // Only add if not already pushed onto the array
            if (!correctLetters.includes(letter)) {
                correctLetters.push(letter);
                displayWord(); // Display the updated word
            } else {
                showNotification(); // Letter is already there
            }
        } else {
            // If it's a wrong letter
            if (!wrongLetters.includes(letter)) {
                wrongLetters.push(letter);
                updateWrongLettersEl(); // Update wrong letters display
            } else {
                showNotification(); // Letter has already been guessed as wrong
            }
        }
    }
});


// play again clicked -> restart game
playAgainBtn.addEventListener('click', () => {
    // empty arrays
    correctLetters.splice(0);
    wrongLetters.splice(0);

    // get a new word
    selectRandomWord();

    displayWord();

    // clean the figure 
    updateWrongLettersEl(); 


    popup.style.display = 'none';
});
