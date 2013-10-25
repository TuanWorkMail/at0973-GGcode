﻿/**************************************************
** CLIENT BOT CLASS
**************************************************/

exports.Bot = function(id, startX, startY, type) {
    var id = id,
        x = startX,
	    y = startY,
        type = type,
        pathFound,
        whereNow = 0,
        to,
        direction,
        speed,
        //image = new Image(),
        width = 40,
        height = 40;

    if (type == 'dumb') {
        var randomNumber = require('./helper').randomNumber;
        switch (randomNumber(1, 4)) {
            case 1:
                direction = 'up';
                break;
            case 2:
                direction = 'down';
                break;
            case 3:
                direction = 'left';
                break;
            case 4:
                direction = 'right';
                break;
        }
        speed = 2;
        //image.src = 'images/8bit_enemy.png';
    } else if (type == 'smart') {
        speed = 5;
        //image.src = 'images/bot2.png';
    }

    // Getters and setters
    function getX() { return x; }
    function setX(para) { x = para; }
    function getY() { return y; }
    function setY(para) { y = para; }
    function getID() { return id; }
    function setID(para) { id = para; }
    function getType() { return type; }
    function setType(para) { type = para; }
    function getPathFound() { return pathFound; }
    function setPathFound(para) { pathFound = para; }
    function getWhereNow() { return whereNow; }
    function setWhereNow(para) { whereNow = para; }
    function getDirection() { return direction; }
    function setDirection(para) { direction = para; }
    function getSpeed() { return speed; }
    function setSpeed(para) { speed = para; }
    function getImage() { return image; }
    function setImage(para) { image = para; }
    function getWidth() { return width; }
    function setWidth(para) { width = para; }
    function getHeight() { return height; }
    function setHeight(para) { height = para; }

    // Define which variables and methods can be accessed
    return {
        getX: getX,
        setX: setX,
        getY: getY,
        setY: setY,
        getID: getID,
        setID: setID,
        getType: getType,
        setType: setType,
        getPathFound: getPathFound,
        setPathFound: setPathFound,
        getWhereNow: getWhereNow,
        setWhereNow: setWhereNow,
        getDirection: getDirection,
        setDirection: setDirection,
        getSpeed: getSpeed,
        setSpeed: setSpeed,
        getImage: getImage,
        setImage: setImage,
        getWidth: getWidth,
        setWidth: setWidth,
        getHeight: getHeight,
        setHeight: setHeight,
        
        id: id,
        x: x,
        y: y,
        type: type,
        pathFound: pathFound,
        whereNow: whereNow,
        to: to,
        direction: direction,
        speed: speed,
        //image: image,
        width: width,
        height: height
        
    }
};