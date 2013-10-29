var lasers = [],
    laserSpeed = 15;

//input: x,y,direction of the bullet
//push new bullet into array and emit to server
 function shooting(x,y,direction) {
    var id = createUUID('xxxx');
    var newBullet = new Bullet(id, x, y, direction, false);
    lasers.push(newBullet);
    socket.emit("new lasers", { id: id, x: x, y: y, direction: direction });
}

//If there are lasers in the lasers array, then this will draw them on the canvas
function drawLaser() {
    for (var i = 0; i < lasers.length; i++) {
        ctx.fillStyle = '#f00';
        ctx.fillRect(lasers[i].x - 2, lasers[i].y - 2, 4, 4);
    }
}

//If we're drawing lasers on the canvas, this moves them in the canvas
function moveLaser() {
    for (var i = 0; i < lasers.length; i++) {
        if (lasers[i].direction == 'up') {
            lasers[i].y -= laserSpeed;
        } else if (lasers[i].direction == 'down') {
            lasers[i].y += laserSpeed;
        } else if (lasers[i].direction == 'right') {
            lasers[i].x += laserSpeed;
        } else if (lasers[i].direction == 'left') {
            lasers[i].x -= laserSpeed;
        }
        if (mapCollision(lasers[i].x, lasers[i].y, 4, 4, 'bullet')) {
            renderBulletDestroyed(lasers[i]);
            lasers[i].isRemoved = true;
        } else if (lasers[i].y < 0 || lasers[i].y > height || lasers[i].x < 0 || lasers[i].x > width) {
            lasers[i].isRemoved = true;
        }
    }
    removeBullet(lasers);
}

function renderBulletDestroyed(bulletObject) {
    
}

function removeBullet(lasers) {
    if(lasers.length==0) return;
    var endOfArray = false;
    while(!endOfArray) {
        for (var i = 0; i < lasers.length; i++) {
            if(i==lasers.length-1) {
                endOfArray=true;
            }
            if(lasers[i].isRemoved) {
                lasers.splice(i, 1);
                //get out of loop
                i = lasers.length;
            }
        }
    }
}

if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
    exports.lasers = lasers;
    exports.shooting = shooting;
    var socket = require('../server/js/socket').socket;
}