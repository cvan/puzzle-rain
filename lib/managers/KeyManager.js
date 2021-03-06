'use strict';

var State = require('../state/State');
var Events = require('../events/Events');
var settings = require('../settings');

var moveForward = false;
var moveBackwards = false;
var moveLeft = false;
var moveRight = false;
var moveUp = false;
var moveDown = false;

var rotateUp = false;
var rotateDown = false;
var rotateLeft = false;
var rotateRight = false;

var isPressed = false;
var lastPressed = false;

var activeHand = 'R';

function KeyManager () {
  document.addEventListener('keydown', onDocumentKeyDown, false);
  if (!State.get('vrDisplay')) {
    document.addEventListener('keyup', onDocumentKeyUp, false);
    Events.on('updateScene', update);
  }
}

function onDocumentKeyDown (event) {
  // http://keycode.info/
  switch (event.keyCode) {
    case 38: // up
      moveForward = true;
      break;
    case 40: // down
      moveBackwards = true;
      break;
    case 37: // left
      moveLeft = true;
      break;
    case 39: // right
      moveRight = true;
      break;
    case 48: // 0
      Events.emit('switchCamera', 0);
      break;
    case 49: // 1
      Events.emit('switchCamera', 1);
      break;
    case 50: // 2
      Events.emit('switchCamera', 2);
      break;
    case 51: // 3
      Events.emit('switchCamera', 3);
      break;
    case 52: // 1
      Events.emit('switchCamera', 4);
      break;
    case 81: // q
      moveUp = true;
      break;
    case 65: // a
      moveDown = true;
      break;
    case 90: // z
      isPressed = true;
      break;
    case 87: // w
      rotateUp = true;
      break;
    case 83: // s
      rotateDown = true;
      break;
    case 69: // e
      rotateLeft = true;
      break;
    case 68: // d
      rotateRight = true;
      break;
    case 82: // r
      activeHand = 'R';
      break;
    case 76: // l
      activeHand = 'L';
      break;
    case 89: // y
      if (settings.debugMode) {
        Events.emit('dispatchEnding', 1);
      }
      break;
    case 78: // n
      if (settings.debugMode) {
        Events.emit('dispatchEnding', 2);
      }
      break;
    case 84: // t
      Events.emit('nextCamera');
      break;
    case 32: // space
      // Events.emit('changeSpectatorMode');
      break;
  }
}

function onDocumentKeyUp (event) {
  switch (event.keyCode) {
    case 38: // up
      moveForward = false;
      break;
    case 40: // down
      moveBackwards = false;
      break;
    case 37: // left
      moveLeft = false;
      break;
    case 39: // right
      moveRight = false;
      break;
    case 81: // q
      moveUp = false;
      break;
    case 65: // a
      moveDown = false;
      break;
    case 90: // z
      isPressed = false;
      break;
    case 87: // w
      rotateUp = false;
      break;
    case 69: // e
      rotateLeft = false;
      break;
    case 68: // d
      rotateRight = false;
      break;
    case 83: // s
      rotateDown = false;
      break;
  }
}

function update () {
  if (moveForward) {
    Events.emit('move', activeHand, 'forward');
  }
  if (moveBackwards) {
    Events.emit('move', activeHand, 'backwards');
  }
  if (moveLeft) {
    Events.emit('move', activeHand, 'left');
  }
  if (moveRight) {
    Events.emit('move', activeHand, 'right');
  }
  if (moveUp) {
    Events.emit('move', activeHand, 'up');
  }
  if (moveDown) {
    Events.emit('move', activeHand, 'down');
  }
  if (rotateUp) {
    Events.emit('move', activeHand, 'rotateUp');
  }
  if (rotateDown) {
    Events.emit('move', activeHand, 'rotateDown');
  }
  if (rotateLeft) {
    Events.emit('move', activeHand, 'rotateLeft');
  }
  if (rotateRight) {
    Events.emit('move', activeHand, 'rotateRight');
  }
  if (lastPressed !== isPressed) {
    lastPressed = isPressed;
    // handL because is the Dummy one
    Events.emit('trigger', activeHand, isPressed);
  }
}

KeyManager.prototype.init = function () {
  if (settings.debugMode) {
    console.log('Orbit camera/headset with your mouse');
    console.log('Press "r or l" to change active hand');
    console.log('Press "arrows" to move a hand');
    console.log('Press "q / a" to move hand up / down');
    console.log('Press "w / s" to rotate hand up / down');
    console.log('Press "e / d" to rotate hand left / right');
    console.log('Press "z" to dispatch magic');
    console.log('Press Y (to force happy end) or N (to force sad end)');
  }
  if (settings.trailerMode) {
    console.log('Press "t" to change to the next trailer camera or press grip buttons on your controllers');
  }
};

module.exports = new KeyManager();
