let piece = {}

let pieceOp = {

    addPiece: function(name, char) {

        piece[name] = {};
        piece[name].char = char;

        plateOp.placePiece(name, 0);

    },

    removePiece: function(name) {
        
        piece[name] = undefined;

    }
    
}