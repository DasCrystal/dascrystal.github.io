
const themes = [
        ["antiquewhite", "black", "goldenrod"],
        ["black", "antiquewhite", "gold"],
    ];

class TheWord
{    
    Words;
    word; index; progress;
    wrongTyping = "";
    totalWords = -1;
    correctTypes = 0; wrongTypes = 0;
    totalCorrectTypes = 0; totalWrongTypes = 0;
    records = ['WHEN TIME  SPEED  ACC', '     WT  + RT   = TT']; // "POINT M:S SPEEDrt/s ACC.RATE%"
    lap = 10; finishLine = 10; // in words

    whileTimer = 0;
    totalTimer = 0;
    timing = false;

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
            return false;
        }
        this.word = data.word;
        this.index = data.index;
        this.progress = 0;
        this.#updateWord();
        this.totalWords = data.totalWords;
        this.totalCorrectTypes = data.totalCorrectTypes;
        this.#updateScore();
        this.records = data.records;
        this.#updateRecord();
        this.totalTimer = data.totalTimer;
        this.whileTimer = 0;
        this.updateLap(data.lap);
        return true;
    }

    constructor(words) {
        this.Words = words;
        this.#onComplete();
    }

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
        document.querySelector("#theScore").textContent = this.totalWords;
    }

    #updateWord() {
        document.querySelector("#theNumber").textContent = `No.${this.index}`;
        document.querySelector("#theWord").innerHTML = this.genElement();
        document.querySelector("#fullWord").textContent = `"${this.word}"`;
        // resize for large word area
        let wordSize = document.querySelector("#theWord").textContent.length;
        let fSize = wordSize > 10 ? 1000 / wordSize : 100;
        document.querySelector("#wordArea").style.setProperty("--fsize", `${fSize}px`);
    }

    #updateRecord(text = null)
    {
        let table = "";

        for (let record of this.records) {
            table += `<li>${record}</li>`;
        }
        if (text != null) {
            table += `<li>${text}</li>`
        }
        
        let theRecord = document.querySelector("#theRecord");
        theRecord.innerHTML = table;
        theRecord.scrollTo(0, theRecord.scrollHeight);
    }

    updateLap(lap = null) {
        this.lap = lap == null ? this.lap : lap;
        this.finishLine = this.totalWords + this.lap;
        document.querySelector('#theFinish').textContent = `-> ${this.finishLine}`;
    }

    appendRecord(record = null) {
        if (record == null) {
            let score = this.totalWords;
            let time  = this.getTimerTime(this.whileTimer);
            let speed = Math.floor((this.correctTypes / (this.whileTimer == 0 ? 1 : this.whileTimer)) * 10) / 10;
            let corrects = this.correctTypes;
            let wrongs   = this.totalWrongTypes;
            let rate  = Math.floor(corrects / (corrects + wrongs) * 1000) / 10.0;
            rate = !rate ? 0 : rate;
            this.records.push(`${score} ${time.mintue}:${time.second} ${speed}rt/s ${rate}%`);
            this.records.push(`${' '.repeat(score.toString().length)} ${corrects + wrongs} - ${wrongs}! = ${corrects} chars.`);
            this.#updateRecord();
        } else {
            this.#updateRecord(record);
        }
        
        this.whileTimer = 0;
        this.correctTypes = 0;
        this.totalWrongTypes = 0;
    }

    #onComplete() {
        this.totalWords += 1;
        
        this.progress = 0;
        this.wrongTypes = 0;
        this.isCurrentWordCorrect = true;
        this.#nextWord();
        this.#updateWord();
        this.#updateScore();

        // give & record segmental result
        if (this.totalWords != 0 && this.totalWords == this.finishLine) {
            this.appendRecord();
            this.timing = false;
            this.save();
            this.updateLap();
        }
    }

    check(input) {
        if (!this.timing) {
            if (input == "Enter") {
                this.timing = true;
                document.querySelector("#wordSuffix").textContent = " ";
            } 
            return;
        }

        // if (input == "Backspace") {
        //     this.wrongTyping = this.wrongTyping.substring(0, this.wrongTyping.length - 1);
        //     this.#updateWord();
        //     return;
        // }
        
        // if (input.length != 1) {
        //     document.querySelector("#wordSuffix").innerHTML = `<span content=" ${input}?"> ${input}?</span>`;
        //     return;
        // } else {
        //     document.querySelector("#wordSuffix").innerHTML = "";
        // }

        if (!this.wrongTyping && (input == " " || input.toUpperCase() == this.#currentChar().toUpperCase())) {
            this.progress += 1;
            this.correctTypes += 1;
            this.totalCorrectTypes += 1;
            if (this.progress >= this.word.length) {
                document.querySelector("#wordSuffix").textContent = " ";
                this.#onComplete();
                new Audio('./typewriter-hard-click.wav').play();
            } else {
                new Audio('./typewriter-soft-click.wav').play();
            }
        } else {
            this.wrongTypes += 1;
            this.totalWrongTypes += 1;
            document.querySelector("#wordSuffix").textContent =
                this.wrongTypes <= 10 ? '!'.repeat(this.wrongTypes) : '!'.repeat(10) + ` (+${this.wrongTypes - 10})`;
        }

        this.#updateWord();
        this.#updateScore();
    }
    
    genElement() {
        return `<span class="wordPartA">${this.word.slice(0, this.progress)}</span><span class="wrongTyping">${this.wrongTyping}</span><span class="wordPartB" content="${this.word.slice(this.progress)}">${this.word.slice(this.progress)}</span>`;
    }
}

window.onload = async function () {

    // Themes

    let theme  = parseInt(localStorage.getItem("theme")) || 0;
    let themeButton = document.querySelector("#titleArea div:nth-child(1)");
    function paint(theme)
    {
        document.body.style.setProperty("--bgcolor",  themes[theme][0]);
        document.body.style.setProperty("--fgcolor",  themes[theme][1]);
        document.body.style.setProperty("--errcolor", themes[theme][2]);
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
    
    if (!theWord.load()) {
        theWord.save();
    }

    // main mechnism

    window.addEventListener(
        'keydown',
        (event) => {
            
            if (event.key == 'Escape') {
                // quick restart
                theWord.load();
                theWord.timing = false;
            } else {
                theWord.check(event.key);
            }
        }
    );

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
                document.querySelector("#wordSuffix").textContent = "PRESS ENTER";
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

    theWord.appendRecord(`Lap size is ${theWord.lap} words now.`);
    let recordArea = document.querySelector("#recordArea");
    let levels = [10, 100, 1000], level = levels.indexOf(theWord.lap);
    recordArea.addEventListener(
        'click',
        () => {
            level = (level + 1) % levels.length;
            theWord.updateLap(levels[level]);
            let record = `Lap size is ${theWord.lap} words now.`;

            if (!theWord.timing) {
                theWord.save();
            } else {
                record += `\n(Will save on timer stops.)`;
            }

            theWord.appendRecord(record);
        }
    );
}