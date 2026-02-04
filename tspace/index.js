
class TheWord {
    
    Words;
    word; index; progress;
    totalWords = -1;
    correctTypes = 0; wrongTypes = 0;
    totalCorrectTypes = 0; totalWrongTypes = 0;
    records = ["POINT M:S SPEEDrt/s ACC.RATE%"];
    lap = 10;

    save() {
        let data = {
            word: this.word,
            index: this.index,
            totalWords: this.totalWords,
            totalCorrectTypes: this.totalCorrectTypes,
            totalTimer: this.totalTimer,
            records: this.records,
            lap: this.lap,
        };
        localStorage.setItem("data", JSON.stringify(data)); // console.log("save:", data)
    }

    load() {
        let data = JSON.parse(localStorage.getItem("data")); // console.log("load:", data)
        if (data == null) {
            return;
        }
        this.word = data.word;
        this.index = data.index;
        this.#updateWord();
        this.totalWords = data.totalWords;
        this.totalCorrectTypes = data.totalCorrectTypes;
        this.#updateScore();
        this.records = data.records;
        this.#updateRecord();
        this.totalTimer = data.totalTimer;
        this.lap = data.lap;
    }

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
        this.index = Math.floor(Math.random() * 10000 % this.Words.length);
        this.word = this.Words[this.index].word;
    }

    #currentChar() {
        return this.word[this.progress];
    }

    #updateScore() {
        document.querySelector("#wordScore").textContent = this.totalWords;
        document.querySelector("#charScore").textContent = this.totalCorrectTypes;
    }

    #updateWord() {
        document.querySelector("#theNumber").textContent = `No.${this.index}`;
        document.querySelector("#theWord").innerHTML = this.genElement();
    }

    #updateRecord() {
        let table = "";
        for (let record of this.records) {
            table += `<li>${record}</li>`;
        }

        let theRecord = document.querySelector("#theRecord");
        theRecord.innerHTML = table;
        theRecord.scrollTo(0, theRecord.scrollHeight);
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
        
        this.whileTimer = 0;
        this.correctTypes = 0;
        this.wrongTypes = 0;

        this.records.push(record);
        this.#updateRecord();
    }

    #onComplete() {
        this.totalWords += 1;
        
        this.progress = 0;
        this.isCurrentWordCorrect = true;
        this.#nextWord();
        this.#updateWord();
        this.#updateScore();

        // resize for jumbo word
        let fsize = this.word.length >= 10 ? 90 : 100;
        document.querySelector("#wordArea").style.setProperty("--fsize", `${fsize}px`);

        // recording
        if (this.totalWords != 0 && this.totalWords % this.lap == 0) {
            this.appendRecord();
            this.timing = false;
        }
    }

    check(input) {

        if (!this.timing) {
            if (input == "Enter") {
                this.timing = true;
                document.querySelector("#wordSuffix").textContent = "";
            }
            return;
        }

        if (input == " " || input.toUpperCase() == this.#currentChar().toUpperCase()) {
            this.progress += 1;
            this.correctTypes += 1;
            this.totalCorrectTypes += 1;
            if (this.progress >= this.word.length) {
                this.#onComplete();
                this.save();
            }

            document.querySelector("#wordSuffix").textContent = "";
            document.querySelector("#theWord").innerHTML = this.genElement();
        } else {
            this.wrongTypes += 1;
            this.totalWrongTypes += 1;

            document.querySelector("#wordSuffix").innerHTML = `<spam content=" ${input}?"> ${input}?</spam>`;
        }

        this.#updateScore();
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
    let theWord = new TheWord(Words); theWord.load();

    // main mechnism

    window.addEventListener(
        'keydown',
        (event) => {
            theWord.check(event.key);
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

    let word = document.querySelector("#theWord");

    word.addEventListener(
        'click',
        () =>  {
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
            } else {
                document.querySelector("#wordSuffix").textContent = " PRESS ENTER";
            }

            let time = theWord.getTimerTime(theWord.totalTimer);
            let state = theWord.timing ? "" : "||"
            document.querySelector("#theTimer").textContent = `${time.mintue}:${time.second} ${state}`;
        },
        100
    );

    // mouse track
    
    let pointer = {x: 0, y: 0};
    document.addEventListener(
        'mousemove',
        (event) => {
            let {x, y} = event;
            pointer = {x, y};
            hintElement.style.setProperty("top", `${y+25}px`);
            hintElement.style.setProperty("left", `${x+25}px`);
        }
    );

    // hinting

    let hintElement = document.querySelector("#hint");
    function updateHintContent() {
        let hints = document.elementsFromPoint(pointer.x, pointer.y);
        for (let hint of hints) {
            let hintContent = hint.getAttribute("hint");
            if (hintContent != null) {
                hintElement.style.setProperty("display", "block");
                hintElement.textContent = hintContent;
                hints = null;
                break;
            }
        }
        if (hints != null) {
            hintElement.style.setProperty("display", "none");
            hintElement.textContent = "";
        }
    }
    window.setInterval(
        () => {
            updateHintContent();
        },
        100
    );

    // lap changing

    if (!((theWord.records.at(-1) || "").startsWith("Lap size"))) {
        theWord.appendRecord(`Lap size is ${theWord.lap} words now.`);
    }
    let recordArea = document.querySelector("#recordArea");
    let levels = [10, 100, 1000], level = levels.indexOf(theWord.lap);
    recordArea.addEventListener(
        'click',
        () => {
            level = (level + 1) % levels.length;
            theWord.lap = levels[level];
            theWord.appendRecord(`Lap size is ${theWord.lap} words now.`);
            theWord.save();
        }
    );
}