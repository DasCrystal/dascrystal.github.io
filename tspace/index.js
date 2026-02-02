
class TheWord {
    
    Words;
    word; progress;
    totalWords = -1;
    correctTypes = 0; wrongTypes = 0;
    records = [];

    constructor(words) {
        this.Words = words;
        this.#onComplete();
    }

    whileTimer = 0;
    totalTimer = 0;
    timing = false;
    getTimerTime(timer) {
        let mintue = `${Math.floor(timer / 60)}`;
        mintue = mintue.length == 1 ? "0" + mintue : mintue;
        let second = `${timer % 60}`;
        second = second.length == 1 ? "0" + second : second;
        return {mintue, second};
    }

    #nextWord() {
        let index = Math.floor(Math.random() * 10000 % this.Words.length);
        this.word = this.Words[index].word;
        return index;
    }

    #currentChar() {
        return this.word[this.progress];
    }

    #updateScore() {
        document.querySelector("#wordScore").textContent = this.totalWords;
        document.querySelector("#charScore").textContent = this.correctTypes - this.wrongTypes;
    }

    appendRecord(record = null) {

        if (record == null) {
            let score = this.totalWords;
            let time  = this.getTimerTime(this.whileTimer);
            let speed = Math.floor((this.correctTypes / this.whileTimer) * 10) / 10;
            let rate  = Math.floor(this.correctTypes / (this.correctTypes + this.wrongTypes) * 1000) / 10.0;
            rate = !rate ? 0 : rate;
            record = `${score} ${time.mintue}:${time.second} ${speed}rt/s ${rate}%`;
        }
        
        this.records.push(record);

        if (this.records.length > 10) {
            this.records.splice(1, 1);
        }

        this.whileTimer = 0;
        this.correctTypes = 0;
        this.wrongTypes = 0;

        let table = "";
        for (let record of this.records) {
            table += `<li>${record}</li>`;
        }

        document.querySelector("#recordArea").innerHTML = table;
    }

    #onComplete() {

        this.totalWords += 1;
        let index = this.#nextWord();
        
        this.progress = 0;
        this.isCurrentWordCorrect = true;
        document.querySelector("#theNumber").textContent = `No.${index}`;
        document.querySelector("#theWord").innerHTML = this.genElement();
        this.#updateScore();

        // resize for jumbo word
        let fsize = this.word.length >= 10 ? 90 : 100;
        document.querySelector("#wordArea").style.setProperty("--fsize", `${fsize}px`);

        // recording
        if (this.totalWords == 0) {
            this.appendRecord("POINT M:S SPEEDrt/s ACCRATE%")
        }
        else if (this.totalWords % 10 == 0) {
            this.appendRecord();
            this.timing = false;
        }
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

    // Themes

    let theme  = parseInt(localStorage.getItem("theme")) || 0;
    let themes = [
        ["antiquewhite", "black"],
        ["black", "antiquewhite"],
    ];
    let themeButton = document.querySelector("#titleArea div:nth-child(1)");
    
    function paint(theme)
    {
        document.body.style.setProperty("--bgcolor",  themes[theme][0]);
        document.body.style.setProperty("--fgcolor",  themes[theme][1]);
    }
    paint(theme);

    themeButton.addEventListener(
        'click',
        () => {
            theme = (theme + 1) % themes.length;
            localStorage.setItem("theme", theme);
            paint(theme);
        }
    );

    // loading data

    document.querySelector("#theWord").innerHTML = `<span class='wordPartB' content="Loading...">Loading...</span>`

    let Words = await fetch('./words.json').then(resp => resp.json());
    let theWord = new TheWord(Words);

    // main mechnism

    window.addEventListener(
        'keydown',
        (event) => {
            theWord.timing = true;

            if (theWord.check(event.key)) {
                document.querySelector("#wordSuffix").textContent = "";
                document.querySelector("#theWord").innerHTML = theWord.genElement();
            } else {
                document.querySelector("#wordSuffix").innerHTML = `<spam content=" ${event.key}?"> ${event.key}?</spam>`;
            }
        }
    );

    // Score
    
    let toDisplay = 1;
    let score = document.querySelector("#scoreArea");

    score.addEventListener(
        'click',
        () => {
            document.querySelector(`#theScore div:nth-child(1)`).style.setProperty("display", `${toDisplay == 1 ? "block" : "none"}`);
            document.querySelector(`#theScore div:nth-child(2)`).style.setProperty("display", `${toDisplay == 2 ? "block" : "none"}`);
            toDisplay = toDisplay == 1 ? 2 : 1;
        }
    )

    score.click();

    // click word to full screen

    let word = document.querySelector("#wordArea");

    word.addEventListener(
        'click',
        (event) =>  {

            if (!document.fullscreenElement) {
                document.body.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        }
    );

    // timer

    let part = 0;

    window.setInterval(
        () => {
            if (theWord.timing) {
                part += 1;
                if (part >= 10) {
                    theWord.totalTimer += 1;
                    theWord.whileTimer += 1;
                    part = 0;
                }
            }
            let time = theWord.getTimerTime(theWord.totalTimer);
            let state = theWord.timing ? "" : "||"
            document.querySelector("#theTimer").textContent = `${time.mintue}:${time.second} ${state}`;
        },
        100
    );

    // start typing test

}