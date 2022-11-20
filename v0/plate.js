
let plate = document.querySelector("plate").childNodes;

let CharToEle = (char) => `<div style="color: #FFFFFF; background-color: #000000;">${char}</div>`

let plateOp = {

    eventSeed: {

        toCurrent: function() {

        },

        fromCurrent: function() {


        },

    },

    removPiece: function(name) {
        
        let at = piece[name].at
        plate[at].innerHTML = plate[at].innerHTML.replace(CharToEle(piece[name].char), "");
        piece[name].at = null;

    },

    placePiece: function(name, to) {

        plate[to].innerHTML += CharToEle(piece[name].char);
        piece[name].at = to;

    },

    movePiece: function(name, to) {

        this.removPiece(name);
        this.placePiece(name, to);

    },

    addBlock: function(content, x, y) {
        
        // Starts from upper left

        let px = (x == undefined ? 0 : x) * 12 + 50;
        let py = (y == undefined ? 0 : y) * 12 + 50;
        
        let newBlockStyle = `bottom: ${py}%; left: ${px}%; transform: rotate(${Math.random() * 30 - 15}deg);`
        let newBlockIndex = document.querySelector("plate").childNodes.length;

        content = content || "";
        content = content == "#" ? newBlockIndex: content;

        document.querySelector("plate").innerHTML += `<block id="block${newBlockIndex}" style="${newBlockStyle}">${content}</block>`;

    } 

}
