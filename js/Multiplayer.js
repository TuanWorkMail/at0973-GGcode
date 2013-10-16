
/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setSocketEventHandlers = function() {
	// Keyboard
	//window.addEventListener("keydown", onKeydown, false);
	//window.addEventListener("keyup", onKeyup, false);

	// Socket connection successful
	socket.on("connect", onSocketConnected);

	// Socket disconnection
	socket.on("disconnect", onSocketDisconnect);

	// New player message received
	socket.on("new player", onNewPlayer);

	// Player move message received
	socket.on("move player", onMovePlayer);
	
	// Lasers move message received
	socket.on("new lasers", onNewLasers);

	// Player removed message received
	socket.on("remove player", onRemovePlayer);

    // Bot broadcast message received
	socket.on("bot broadcast", onBotBroadcast);

    // Bot die message received
	socket.on("bot die", onBotDie);

    // Bot die message received
	socket.on("login", onLogin);

    // Testing message received
	socket.on("test", onTest);

    // Bot die message received
	socket.on("register", onRegister);

    // Input message received
	socket.on("input", onInput);

    // End message received
	socket.on("end match", onEndMatch);

    // Host message received
    socket.on("host", onHost);

    socket.on("temporary message", onTemp);
};

// Socket connected
function onSocketConnected() {
    console.log("Connected to socket server");
    console.log("ID: " + this.socket.sessionid);

    //if host send a message to server
    /*
    if (host)
        socket.emit("host", { host: host });
    else {
        // Send local player data to the game server
        socket.emit("new player", { hello: 'world' });
    }
    */
};

// Socket disconnected
function onSocketDisconnect() {
	console.log("Disconnected from socket server");
};

// New player
function onNewPlayer(data) {
    if (!host) return;

    //where to spawn ship
    var objGroup = tmxloader.map.objectgroup['spawn'].objects;
    var x = objGroup[playerLength % objGroup.length].x,
        y = objGroup[playerLength % objGroup.length].y,
        direction;
    if (playerLength % objGroup.length == 0)
        direction = 'up';
    else
        direction = 'down';
    var player = addNewPlayer(data.id, data.username, x, y, direction);
    player.setUserID(data.userID);
    console.log('new player userID: '+data.userID+' and username: '+data.username);
    socket.emit("move player", { id: data.id, username: data.username, x: x, y: y, direction: direction });
    playerLength++;
};

//add new player to array
function addNewPlayer(id, username, x, y, direction) {
    console.log("New player connected: " + id);

    // Initialise the new player
    var newPlayer = new dto.Player(x, y, direction);
    newPlayer.setSocketID(id);
    newPlayer.setUsername(username);

    // Add new player to the remote players array
    remotePlayers.push(newPlayer);

    for(var i=0;i<remotePlayers.length;i++)
        if(remotePlayers[i].getUsername()==username)
            return remotePlayers[i];
}

// Move player
function onMovePlayer(data) {
    var movePlayer = playerById(data.id);

	// Player not found
	if (!movePlayer) {
	    addNewPlayer(data.id, data.username, data.x, data.y, data.direction);
		return;
	};

	// Update player position
	movePlayer.setX(data.x);
	movePlayer.setY(data.y);
	movePlayer.setDirection(data.direction);
};

// Move lasers
function onNewLasers(data) {
	//add new lasers
    var newBullet = new Bullet(data.id, data.x, data.y, data.direction, false);
    lasers.push(newBullet);
};

// Remove player
function onRemovePlayer(data) {
	var removePlayer = playerById(data.id);

	// Player not found
	if (!removePlayer) {
		console.log("Remove: Player not found: "+data.id);
		return;
	};

	// Remove player from array
	remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
};

// Bot broadcast
function onBotBroadcast(data) {
    var bot = botById(data.count);
    if (bot!=false) {
        bot.setX(data.x);
        bot.setY(data.y);
        bot.direction=data.direction;
        bot.type = data.type;
        return;
    }
    var newBot = new Bot(data.count, data.x, data.y, data.type);
    newBot.direction = data.direction;
    remoteBots.push(newBot);
};

// Bot die
function onBotDie(data) {
    var bot = botById(data.count);
    if (bot!=false) {
        for (var i = 0; i < remoteBots.length; i++) {
            if (remoteBots[i].id == data.count)
                remoteBots.splice(i, 1);
        };
        return;
    }
    console.log('bot '+data.count+' not found');
}; 

// Login
function onLogin(data) {
    var string = '<br/>';
    if (data.uuid == 'failed') {
        string += 'wrong username or password';
    } else {
        if(!host) socket.emit("new player", { username: data.username, userID: data.userID });
        string += 'login successfully';
        document.getElementById('login').style.display = 'none';
    }
    document.getElementById('tile').innerHTML += string;
};

// Testing
function onTest(data) {
    console.log(data.test);
};

// Register
function onRegister(data) {
    var string = '<br/>' + data.result;
    document.getElementById('tile').innerHTML += string;
};

// Input
function onInput(data) {
    if (!host) return;
    var player = playerById(data.id);
    if (!player) {
        console.log('Input: player not found');
        return;
    }
    switch (data.move) {
        case 'right':
            player.setDirection('right');
            player.setX(player.getX() + player.getSpeed());
            if (mapCollision(player.getX(), player.getY(), player.getWidth(), player.getHeight(), 'tank')) {
                player.setX(player.getX() - player.getSpeed());
            }
            break;
        case 'left':
            player.setDirection('left');
            player.setX(player.getX() - player.getSpeed());
            if (mapCollision(player.getX(), player.getY(), player.getWidth(), player.getHeight(), 'tank')) {
                player.setX(player.getX() + player.getSpeed());
            }
            break;
        case 'up':
            player.setDirection('up');
            player.setY(player.getY() - player.getSpeed());
            if (mapCollision(player.getX(), player.getY(), player.getWidth(), player.getHeight(), 'tank')) {
                player.setY(player.getY() + player.getSpeed());
            }
            break;
        case 'down':
            player.setDirection('down');
            player.setY(player.getY() + player.getSpeed());
            if (mapCollision(player.getX(), player.getY(), player.getWidth(), player.getHeight(), 'tank')) {
                player.setY(player.getY() - player.getSpeed());
            }
            break;
    }
    socket.emit("move player", { id: data.id, username: player.getUsername(), x: player.getX(), y: player.getY(), direction: data.move });
};

// End
function onEndMatch(data) {
    alive = false;
};

// Host
function onHost(data) {
    if(host != 'none') return;
    host = data.host;
    gameLoop();
};

function onTemp(data) {
    if(!host) return;

};

/**************************************************
 ** BOT FINDER FUNCTION
 **************************************************/
// Find bot by ID
function botById(id) {
    for (var i = 0; i < remoteBots.length; i++) {
        if (remoteBots[i].id == id)
            return remoteBots[i];
    };
    return false;
};

//add new bot to the array
function createRemoteBot() {
    if (whereSpawn == enemiesGroup.length) {
        whereSpawn = 0;
    }
    while (bots.length < maximumBot && whereSpawn < enemiesGroup.length) {
        // Initialise the new bot
        var x = enemiesGroup[whereSpawn].x;
        y = enemiesGroup[whereSpawn].y;
        newBot = new Bot(x, y, botRandomPath(x, y), 0);
        // Add new player to the remote players array
        bots.push(newBot);
        whereSpawn++;
    }
}

/**************************************************
** GAME FINDER FUNCTIONS
**************************************************/
// Find player by ID
function playerById(id) {
	var i;
	for (i = 0; i < remotePlayers.length; i++) {
		if (remotePlayers[i].getSocketID() == id)
			return remotePlayers[i];
	};
	
	return false;
};
// Find player by username
function playerByUsername(username) {
    var i;
    for (i = 0; i < remotePlayers.length; i++) {
        if (remotePlayers[i].getUsername() == username)
            return remotePlayers[i];
    };

    return false;
};




