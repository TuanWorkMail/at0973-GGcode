if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
    exports.shootDestroyBrick = shootDestroyBrick;
    var tmxloader = require('./../server/js/TMX_Engine').tmxloader;
}
function shootDestroyBrick() {
    var remotePlayers = session.getRemotePlayers(),
        destructible = session.getDestructible(),
        indestructible = session.getIndestructible(),
        count=0;
    if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
        playerById = require('./player').playerById;
    }
    while(count<2){
        var array;
        if(count===0){
            array = destructible;
        } else {
            array = indestructible;
        }
        for (var i = 0; i < lasers.length; i++) {
            var laser = lasers[i];
            var playerDimension = tmxloader.map.objectgroup['dimension'].objects[0],
                xtile = Math.round(laser.getX() / tmxloader.map.tileWidth),
                ytile = Math.round(laser.getY() / tmxloader.map.tileHeight),
                halfWidth = playerDimension.width / 2,
                halfHeight = playerDimension.height / 2,
            // STG = snap to grid
                xtileSTG = Math.round(laser.getX() / halfWidth) * 2,
                ytileSTG = Math.round(laser.getY() / halfHeight) * 2,
                xstart, xend, ystart, yend,
                xincrement = 1,
                yincrement = 1;
            switch (laser.getDirection()) {
                case 'up':
                    xstart = xtileSTG - 1;
                    xend = xtileSTG + 1;
                    ystart = ytile;
                    yend = Math.round( (laser.getY() + laser.getSpeed()) / tmxloader.map.tileHeight);
                    increment = -1;
                    break;
                case 'down':
                    xstart = xtileSTG - 1;
                    xend = xtileSTG + 1;
                    ystart = Math.round( (laser.getY() - laser.getSpeed()) / tmxloader.map.tileHeight);
                    yend = ytile;
                    break;
                case 'left':
                    xstart = xtile;
                    xend = Math.round( (laser.getX() + laser.getSpeed()) / tmxloader.map.tileWidth);
                    ystart = ytileSTG - 1;
                    yend = ytileSTG + 1;
                    increment = -1;
                    break;
                case 'right':
                    xstart = Math.round( (laser.getX() - laser.getSpeed()) / tmxloader.map.tileWidth);
                    xend = xtile;
                    ystart = ytileSTG - 1;
                    yend = ytileSTG + 1;
                    break;
            }
            for(var j=xstart; j<xend; j=j+xincrement){
                for(var k=ystart; k<yend; k=k+yincrement){
                    if(array[j][k]==='0') continue;
                    laser.setIsRemoved(true);
                    var destroy = true;
                    if(count!==0){
                        var player = playerById(laser.getOriginID());
                        if(!player || player.players.getBulletType()!=='piercing') {
                            destroy = false;
                        }
                    }
                    if(destroy) removeDestructible(laser.getDirection(), j, k, xtileSTG, ytileSTG, array);
                    // get out of loop
                    j = xend;
                    k = yend;

                    //lasers.splice(i, 1);
                    //return;

                }
            }
        }
        count++;
    }
}
function removeDestructible(direction, x, y, xSTG, ySTG, array) {
    var xstart, xend, ystart, yend;

    switch(direction) {
        case 'up':
        case 'down':
            xstart = xSTG - 2;
            xend = xSTG + 2;
            ystart = y;
            yend = y + 1;
            break;
        case 'left':
        case 'right':
            xstart = x;
            xend = x + 1;
            ystart = ySTG - 2;
            yend = ySTG + 2;
            break;
    }
    for(var m=xstart; m<xend; m++) {
        for(var n=ystart; n<yend; n++){
            array[m][n] = '0';
        }
    }
}