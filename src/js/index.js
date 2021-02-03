const wordList = document.querySelector('.fulllist-words');
const emptyList = document.querySelector('.emptylist-words');



const errorText = document.querySelector('.addword-ertext');

const inputWord = document.querySelector('.addword-input')
const englishWordInput = document.querySelector('.english-input');
const russianWordInput = document.querySelector('.russian-input');

const addWordButton = document.querySelector('.addword-button');

const addedWords = document.querySelector('.wordlist-index span')

const wordLearning = document.querySelector('.wordlearning');
const noWordText = document.querySelector('.nowordtext');
const wordLearningInput = document.querySelector('.wordlearning-youranswer');
const wordQuess = document.querySelector('.wordlearning-wordquess');
const wordAnswer = document.querySelector('.wordlearning-wordanswer');

const skipWordButton = document.querySelector('.wordlearning-skip');
const checkWordButton = document.querySelector('.wordlearning-check');
const yourAnswer = document.querySelector('.wordlearning-youranswer');

const startLearningButton = document.querySelector('.word-start-button');
const startLearningScreen = document.querySelector('.word-start');

const markRight = document.querySelector('.right-mark');
const markWrong = document.querySelector('.wrong-mark');

startLearningButton.addEventListener('click', startLearningHandler)
addWordButton.addEventListener('click', addWordHandler);
checkWordButton.addEventListener('click', checkWord);
skipWordButton.addEventListener('click', skipWord);


function startLearningHandler() {
    startLearningScreen.style.display = "none";
    emptyList.style.display = 'block';
    wordList.style.display = 'none';
    emptyList.innerText = "Words are not available during learning ";
}

function addWordHandler() {
    if (!englishWordInput.value) {
        englishWordInput.style.border = "2px solid #8F0000";
        englishWordInput.focus()
        errorText.style.opacity = '1'
        return
    } else {
        englishWordInput.style.border = "2px solid #ffffff00";
    }

    if (!russianWordInput.value) {
        russianWordInput.style.border = "2px solid #8F0000";
        russianWordInput.focus()
        errorText.style.opacity = '1'
        return
    } else {
        englishWordInput.style.border = "2px solid #ffffff00";
    }
    errorText.style.opacity = '0';
    russianWordInput.style.border = "2px solid #ffffff00";
    englishWordInput.style.border = "2px solid #ffffff00";
    const id = Date.now() + parseInt(Math.random());
    const templateWordHTML = createWordItemLayout(englishWordInput.value, russianWordInput.value, id);
    addWordToList(templateWordHTML);
    addWordInStore(englishWordInput.value, russianWordInput.value, id);
    wordList.style.display = 'flex';
    emptyList.style.display = 'none';
    englishWordInput.value = '';
    russianWordInput.value = '';


    wordLearning.style.display = 'block';
    noWordText.style.display = 'none';
    startLearningScreen.style.display = "flex"
}

function createWordItemLayout(englishWord, russianWord, id) {
    return `
    <div class="fulllist-words-item" data-id=${id}>
      <p class="fulllist-words-item-wordeng">${englishWord}</p>
      <div class="fulllist-words-item-line"></div>
      <p class="fulllist-words-item-wordrus">${russianWord}</p>

      <svg class="fulllist-words-item-btn" onclick="removeWordFromStore(event)">
        <use xlink:href="src/svg/svgobjects.svg#bin"></use>
      </svg>
    </div>
    `;
};

function addWordToList(template) {
    wordList.insertAdjacentHTML("afterbegin", template)

}

function addWordInStore(englishWord, russianWord, id) {
    const words = JSON.parse(localStorage.getItem('words')) || []
    const word = {
        english: englishWord,
        russian: russianWord,
        id
    }
    words.push(word)
    addedWords.innerText = words.length;
    localStorage.setItem('words', JSON.stringify(words))
}


function removeWordFromStore(event) {
    const words = JSON.parse(localStorage.getItem('words')) || [];
    const temp = words

    const parent = event.target.closest('.fulllist-words-item');
    const id = parent.dataset.id

    temp.forEach((word, i) => {
        if (word.id == id) {
            words.splice(i, 1)
        }
    });

    localStorage.setItem('words', JSON.stringify(words))
    initialize()
}

function randomGenerator(value) {
    const random = 0 - (0.5) + Math.random() * value - 0 + 1;
    return Math.round(random);

}


function addRandomWord(unique = false) {
    wordAnswer.style.display = "none";
    checkWordButton.removeAttribute('disabled');
    yourAnswer.classList.remove('word-wrong');
    yourAnswer.classList.remove('word-correct');
    markWrong.style.display = "none";
    markRight.style.display = "none";
    if (yourAnswer) {
        yourAnswer.value = '';
    }
    const words = JSON.parse(localStorage.getItem('words')) || [];
    const randomNumber = randomGenerator(words.length);

    if (unique && words[randomNumber - 1].english === wordQuess.innerText) {
        addRandomWord()
        return
    }

    wordQuess.innerHTML = words[randomNumber - 1].english;
    wordAnswer.innerHTML = words[randomNumber - 1].russian;
}

function checkWord() {

    if (yourAnswer.value && wordAnswer.innerText != yourAnswer.value) {
        wordAnswer.style.display = "block";
        yourAnswer.classList.add('word-wrong');
        markWrong.style.display = "block"
        checkWordButton.setAttribute('disabled', true)

        setTimeout(() => {
            addRandomWord(true)
        }, 3500);
    } else if (yourAnswer.value) {
        yourAnswer.classList.add('word-correct');
        wordAnswer.style.display = "block";
        markRight.style.display = "block";
        checkWordButton.setAttribute('disabled')

        setTimeout(() => {
            addRandomWord(true)
        }, 1200);
    }
}

function skipWord() {
    addRandomWord();
}


function initialize() {
    wordList.innerHTML = '';
    const words = JSON.parse(localStorage.getItem('words')) || [];

    addedWords.innerText = words.length;

    if (words.length) {
        addRandomWord();
        wordList.style.display = 'flex';
        emptyList.style.display = 'none';

        wordLearning.style.display = 'block';
        noWordText.style.display = 'none';

        startLearningScreen.style.display = 'flex';

    } else {
        emptyList.style.display = 'block';
        wordList.style.display = 'none';

        wordLearning.style.display = 'none';
        noWordText.style.display = 'block';
        startLearningScreen.style.display = 'none';
    }


    words.forEach(word => {
        const template = createWordItemLayout(word.english, word.russian, word.id);
        addWordToList(template)
    });
}

initialize()