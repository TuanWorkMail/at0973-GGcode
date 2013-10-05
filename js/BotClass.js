
//if host draw from bots, if guest draw from remoteBots
function drawBot() {
    var array;
    if (host == true) {
        array = bots;
    } else if (host == false) {
        array = remoteBots;
    }
    for (var i = 0; i < array.length; i++) {
        drawByDirection(array[i]);
    }
    //drawPath();
}



	
var botCount = 0,
    pathStart,
    pathStartX,
    pathStartY,
    pathEnd,
    thePath,
    thePathX,
    thePathY,
    c,//currently headed to which target in thePath
    //enemiesGroup,

    //grid = new PF.Grid(20, 20, world),
    //finder = new PF.AStarFinder(),
    //where bot will spawn, each map have a number of predefined point
    whereSpawn = 0;

function moveBot() {
    //if (host == false) return;
    createBot();
    for (var bot = 0; bot < bots.length; bot++) {
        if (bots[bot].type == 'smart') {
            if (bots[bot].whereNow < bots[bot].pathFound.length - 1) {
                movingBot(bots[bot]);
            } else {
                bots[bot].pathFound = botRandomPath(bots[bot]);
                bots[bot].whereNow = 0;
            }
        } else if (bots[bot].type == 'dumb') {
            goStraight(bot);
        }
        socket.emit("bot broadcast", { count: bots[bot].id, x: bots[bot].getX(), y: bots[bot].getY(), direction: bots[bot].direction, type: bots[bot].type });
    }
}


//add new bot to the array
function createBot() {
    //reset spawn point when reach the last point
    if (whereSpawn == enemiesGroup.length) {
        whereSpawn = 0;
    }
    while (bots.length < botsLength && whereSpawn < enemiesGroup.length) {
        botCount++;
        // Initialise the new bot
        var x = enemiesGroup[whereSpawn].x,
            y = enemiesGroup[whereSpawn].y;
        //every 3 bot is smart
        if (botCount % 4 == 0) {
            newBot = new Bot(botCount, x, y, 'smart');
            newBot.pathFound = botRandomPath(newBot);
        } else {
            newBot = new Bot(botCount, x, y, 'dumb');
        }
        // Add new player to the remote players array
        bots.push(newBot);
        whereSpawn++;

    }
}



function drawPath() {
    for (var i = 0; i < bots.length; i++) {
        for (var rp = 0; rp < bots[i].pathFound.length; rp++) {
            switch (rp) {
                case 0:
                    spriteNum = 10; // start
                    break;
                case bots[i].pathFound.length -1:
                    spriteNum = 1; // end
                    break;
                default:
                    spriteNum = 4; // path node
                    break;
            }
            ctx.drawImage(spriteSheet, spriteNum * 32, 0, 32, 32, bots[i].pathFound[rp][0] * 32, bots[i].pathFound[rp][1] * 32, 32, 32);
        }
    }
}

//combine all the tile layers together for pathfinding
//output: 1 combined layer
function combineTileLayer() {
    var combined = [];
    for (var layer = 0; layer < tmxloader.map.layers.length; layer++) {
        if (tmxloader.map.layers[layer].name == 'overhead')
            continue;
        //first use 1 layer as the start
        //var new = old[] will create a REFERENCE, not a clone
        //have to manually clone each array in multi-dimentional array
        if (combined.length == 0) {
            for (var i = 0; i < tmxloader.map.width; i++) {
                combined[i] = tmxloader.map.layers[layer].data[i].slice(0);
            }
            continue;
        }
        //if combined is 0 and layer is not 0, combined = 1 (unwalkable)
        for (var i = 0; i < tmxloader.map.width; i++) {
            for (var j = 0; j < tmxloader.map.height; j++) {
                if (combined[i][j] == 0 && tmxloader.map.layers[layer].data[i][j] != 0) {
                    combined[i][j] = 1;
                }
            }
        }
    }
    return combined;
}
//input: the small tile layer
//combine 4x4 into 1 big tile
//check if any tile in 4x4 is unwalkable, make the big tile unwalkable too
//output: the big tile layer
function combine16to1tile(combined) {
    var combinedBig = [];
    for (var width = 0; width < tmxloader.map.width / 4; width++) {
        combinedBig[width] = [];
        for (var height = 0; height < tmxloader.map.height / 4; height++) {
            //if any of 4x4 is unwalkable, flag it unwalkable
            var flag = false;
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    if (combined[width * 4 + i][height * 4 + j] != 0)
                        flag = true;
                }
            }
            if (flag) {
                combinedBig[width][height] = 1;
            } else {
                combinedBig[width][height] = 0;
            }
        }
    }
    return combinedBig;
}

function drawTileLayerRaw(combinedBig) {
    for (var i = 0; i < combinedBig.length; i++) {
        for (var j = 0; j < combinedBig[i].length; j++) {
            document.getElementById('tile').innerHTML += combinedBig[j][i];
            document.getElementById('tile').innerHTML += '  ,  ';//4
        }
        document.getElementById('tile').innerHTML += '<br />';
    }
    document.getElementById('tile').innerHTML += '<br />';
}


//work in progress
//input: coordinate, direction, moving speed and type(tank/bullet)
//move an object according to input parameter
function moving(object, direction, speed, type) {

    //if (mapCollision(ship_x, ship_y, ship_w, ship_h, 'tank')) {
        //ship_x -= shipSpeed;
    //}

    switch (object.direction) {
        case 'up':
            x = - object.speed;
            break;
        case 'down':
            x = + object.speed;
            break;
        case 'left':
            y = - object.speed;
            break;
        case 'right':
            y = + object.speed;
            break;
    }
}
/*

*/