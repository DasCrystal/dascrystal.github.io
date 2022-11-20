
let background = document.background;

// 按鍵 Key

// 空白鍵 => 下一個問題 | SpaceKey => Menu
document.addEventListener("keydown", (event) => {

    if (event.key != " ") {return;}

    // Quad

});

// Esc => 開啟 / 關閉 選單 | Esc => Open / Close Menu
document.addEventListener("keydown", (event) => {

    if (event.key != "Escape") {return;}

    Ui.showMenu();

});


// 棋盤配置 PlateSetup
{
    let ab = (content, x, y) => plateOp.addBlock(content, x, y);
    
    for (let lo = 2; lo >= -3; lo -= 1) {

        ab("#", lo, -2);

    }

    ab("#", -3, -1);

    for (let lo = -3; lo <= 2; lo += 1) {

        ab("#", lo, 0);

    }

    ab("#", 2, 1);

    for (let lo = 2; lo >= -3; lo -= 1) {

        ab("#", lo, 2);

    }
    
}

pieceOp.addPiece("das", "H");

setInterval(() => {
    
    plateOp.movePiece("das", piece["das"].at + 1);

}, 1000);




