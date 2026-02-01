
class TheWord {
    
    Words;
    word; progress;
    corrcetWords = -1; correctTypes = 0;
    wrongWords = 0; wrongTypes = 0;
    isCurrentWordCorrect = true;

    constructor(words) {
        this.Words = words;
        this.#onComplete();
    }

    #nextWord() {
        let index = Math.floor(Math.random() * 10000 % this.Words.length);
        this.word  = this.Words[index].word;
        return index;
    }

    #currentChar() {
        return this.word[this.progress];
    }

    #updateScore() {
        document.querySelector("#wordScore").textContent = this.corrcetWords + this.wrongWords;
        document.querySelector("#charScore").textContent = this.correctTypes - this.wrongTypes;
    }

    #onComplete() {
        let index = this.#nextWord();
        if (this.isCurrentWordCorrect) {
            this.corrcetWords += 1;
        } else {
            this.wrongWords += 1;
        }
        
        this.progress = 0;
        this.isCurrentWordCorrect = true;
        document.querySelector("#theNumber").innerHTML = `<div>No.</div><div>${index}</div>`;
        document.querySelector("#theWord").innerHTML = this.genElement();
        this.#updateScore();

        // resize for jumbo word
        let fsize = this.word.length >= 10 ? 90 : 100;
        document.querySelector("#wordArea").style.setProperty("--fsize", `${fsize}px`); 
    }

    check(input) {

        let result;
        if (input == " " || input.toUpperCase() == this.#currentChar().toUpperCase()) {
            this.progress += 1;
            this.correctTypes += 1;
            if (this.progress >= this.word.length) {
                this.#onComplete();
            }
            result = true;
        } else {
            this.wrongTypes += 1;
            this.isCurrentWordCorrect = false;
            result = false;
        }

        this.#updateScore();

        return result;
    }
    
    genElement() {
        return `<span class="wordPartA">${this.word.slice(0, this.progress)}</span><span class="wordPartB" content="${this.word.slice(this.progress)}">${this.word.slice(this.progress)}</span>`;
    }
}

window.onload = async function () {

    document.querySelector("#theWord").innerHTML = `<span class='wordPartB' content="Loading...">Loading...</span>`

    let Words = await fetch('./words.json').then(resp => resp.json());
    let theWord = new TheWord(Words);

    // Main Mechnism
    window.onkeydown = (e) => {

        if (theWord.check(e.key)) {
            document.querySelector("#wordSuffix").textContent = "";
            document.querySelector("#theWord").innerHTML = theWord.genElement();
        } else {
            document.querySelector("#wordSuffix").innerHTML = `<spam class="wordPartB" content=" ${e.key}?"> ${e.key}?</spam>`;
        }
    }

    // Themes

    let theme = 0,
        themes = [
            ["antiquewhite", "black"],
            ["black", "antiquewhite"],
        ];

    let themeButton = document.querySelector("#titleArea div:nth-child(1)");
    
    themeButton.addEventListener(
        'click',
        () => {
            document.body.style.setProperty("--bgcolor",  themes[theme][0]);
            document.body.style.setProperty("--fgcolor",  themes[theme][1]);
            theme = (theme + 1) % themes.length;
        }
    );

    themeButton.click();

    // Score
    
    let toDisplay = 1;
    let score = document.querySelector("#theScore");

    score.addEventListener(
        'click',
        () => {
            document.querySelector(`#theScore div:nth-child(1)`).style.setProperty("display", `${toDisplay == 1 ? "block" : "none"}`);
            document.querySelector(`#theScore div:nth-child(2)`).style.setProperty("display", `${toDisplay == 2 ? "block" : "none"}`);
            toDisplay = toDisplay == 1 ? 2 : 1;
        }
    )

    score.click();

}