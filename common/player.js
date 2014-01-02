﻿if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
    var util = require('util'),
        main = require('../server/js/main'),
        broadcastToRoom = require('../server/socket-listener').broadcastToRoom,
        tmxloader = require('../server/js/TMX_Engine').tmxloader,
        mapCollision = require('./collision_hitTest').mapCollision,
        Session = require('../common/dto/session').Session,
        dto = {},
        helper = require('./helper'),
        debug = helper.debug,
        reset = require('./session.restart').reset,
        spawnPlayer = require('./player.add-new').spawnPlayer;
    dto.Player = require('./dto/Player').Player;
}
function checkHitPoint () {
    var remotePlayers = session.getRemotePlayers();
    for (var i = 0; i < remotePlayers.length; ++i) {
        if (remotePlayers[i].getHitPoint() <= 0 && alive) {
            debug.log('player ' + remotePlayers[i].getUsername() + ' die');
            remotePlayers[i].setLive(remotePlayers[i].getLive() - 1);
            debug.log('live: ' + remotePlayers[i].getLive());
            checkLive(remotePlayers[i]);
        }
    }
}
function checkLive(object) {
    var remotePlayers = session.getRemotePlayers();
    //if (object.getLive() > 0) {
    if(1===1){
        var result = spawnPlayer(object.getSpawnPoint());
        object.setX(result.x);
        object.setY(result.y);
        object.setDirection(result.direction);
        object.setHitPoint(10);
        broadcastToRoom(main.session.getRoomID(), 'move player', {id: object.getSocketID(), username: object.getUsername(),
            x: object.getX(), y: object.getY(), direction: object.getDirection(), team: object.getTeamName()})
        //reset('');
    } else if (object.getLive() <= 0) {
        //alive = false;
        //continueLoop = false;
        var id = [], score = [];
        for(var i=0;i<2;i++) {
            id[i]=remotePlayers[i].getUserID();
            score[i]=remotePlayers[i].getLive();
        }
        var data = { id1: id[0], id2:id[1], score1: score[0], score2: score[1] };
        main.onEndMatch(data);
        debug.log('id1: '+id[0]+', id2:'+id[1]+', score1: '+score[0]+', score2: '+score[1]);
        reset('end match');
    }
}
var lastDirection = 'left';
function movingPlayer() {
    var remotePlayers = session.getRemotePlayers();
    for(var i = 0;i < remotePlayers.length; i++) {
        if(remotePlayers[i].getMoving())
        switch (remotePlayers[i].getDirection()) {
            case 'right':
                remotePlayers[i].setX(remotePlayers[i].getX() + remotePlayers[i].getSpeed());
                if (mapCollision(remotePlayers[i].getX(), remotePlayers[i].getY(), remotePlayers[i].getWidth(), remotePlayers[i].getHeight(), 'tank')) {
                    remotePlayers[i].setX(remotePlayers[i].getX() - remotePlayers[i].getSpeed());
                }
                break;
            case 'left':
                remotePlayers[i].setX(remotePlayers[i].getX() - remotePlayers[i].getSpeed());
                if (mapCollision(remotePlayers[i].getX(), remotePlayers[i].getY(), remotePlayers[i].getWidth(), remotePlayers[i].getHeight(), 'tank')) {
                    remotePlayers[i].setX(remotePlayers[i].getX() + remotePlayers[i].getSpeed());
                }
                break;
            case 'up':
                remotePlayers[i].setY(remotePlayers[i].getY() - remotePlayers[i].getSpeed());
                if (mapCollision(remotePlayers[i].getX(), remotePlayers[i].getY(), remotePlayers[i].getWidth(), remotePlayers[i].getHeight(), 'tank')) {
                    remotePlayers[i].setY(remotePlayers[i].getY() + remotePlayers[i].getSpeed());
                }
                break;
            case 'down':
                remotePlayers[i].setY(remotePlayers[i].getY() + remotePlayers[i].getSpeed());
                if (mapCollision(remotePlayers[i].getX(), remotePlayers[i].getY(), remotePlayers[i].getWidth(), remotePlayers[i].getHeight(), 'tank')) {
                    remotePlayers[i].setY(remotePlayers[i].getY() - remotePlayers[i].getSpeed());
                }
                break;
            default :
                console.log('movingPlayer: un-recognized direction');
        }
    }
}
// Find player by ID
function playerById(socketid) {
    var _allSession = [];
    if(typeof allSession==='undefined')
        _allSession.push(session);
    else
        _allSession = allSession;
    for (var j=0; j<_allSession.length; j++) {
        var remotePlayers = _allSession[j].getRemotePlayers();
        for (var i = 0; i < remotePlayers.length; i++) {
            if (remotePlayers[i].getSocketID() == socketid)
            // HACKY SOLUTION RETURN LASERS HERE
                return {players:remotePlayers[i],roomID: _allSession[j].getRoomID(), lasers: _allSession[j].getLasers()};
        }

    }
    return false;
}
if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
    exports.checkHitPoint = checkHitPoint;
    exports.movingPlayer = movingPlayer;
    exports.playerById = playerById;
}