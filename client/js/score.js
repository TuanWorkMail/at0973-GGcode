﻿var alive = true,
    lives = 3;

//After the player loses all their lives, the continue button is shown and if clicked, it resets the game and removes the event listener for the continue button
function continueButton(e) {
    var width = tmxloader.map.width * tmxloader.map.tileWidth,
        height = tmxloader.map.height * tmxloader.map.tileHeight;
    var cursorPos = getCursorPos(e);
    if (cursorPos.x > (width / 2) - 53 && cursorPos.x < (width / 2) + 47 && cursorPos.y > (height / 2) + 10 && cursorPos.y < (height / 2) + 50) {
        alive = true;
        lives = 3;
        reset('');
        canvasOverhead.removeEventListener('click', continueButton, false);
    }
}

function scoreTotal() {
    var gameStarted = tank5.main.getGameStarted();
    /*
    ctx.fillText('Score: ', 10, 55);
    ctx.fillText(score, 70, 55);
    ctx.fillText('Lives:', 10, 30);
    ctx.fillText(lives, 68, 30);
    */
    if (!gameStarted) {
        drawStartScreen();
    }
    if (!alive) {
        drawEndScreen();
    }
}

function gameStart() {
    tank5.main.setGameStarted(true);
    canvas.removeEventListener('click', gameStart, false);
}