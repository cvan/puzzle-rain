'use strict';

var Events = require('../../events/Events');
var State = require('../../state/State');
var THREE = require('three');

function ActiveGroupHandler (obj) {
  this.obj = obj;

  this.activeObj;
  this.handlerList = [];
  Events.on('updateScene', this.update.bind(this));
  Events.on('activeRaceChanged', this.activeRaceChanged.bind(this));
}

ActiveGroupHandler.prototype.update = function () {
  if (this.obj.lastPressed) {
    return;
  }
  var totalIntersections = 0;
  for (var i = 0; i < this.handlerList.length; i++) {
    if (this.handlerList[i].isActive) {
      var handlerPos = new THREE.Vector3().setFromMatrixPosition(this.handlerList[i].matrixWorld);
      var handPos = new THREE.Vector3().setFromMatrixPosition(this.obj.matrixWorld);
      var dist = handlerPos.distanceTo(handPos);
      if (dist < this.handlerList[i].radius * 4) {
        totalIntersections++;
        if (this.activeObj !== this.handlerList[i]) {
          this.activeObj = this.handlerList[i];
          Events.emit('activeHandlerDispatch', this.obj.side, this.handlerList[i]);
        }
      }
    }
  }
  if (totalIntersections === 0 && this.activeObj !== null) {
    this.activeObj = null;
    Events.emit('activeHandlerDispatch', this.obj.side, null);
  }
};

ActiveGroupHandler.prototype.activeRaceChanged = function (side, race) {
  if (side === this.obj.side) {
    if (race === 'none') {
      this.removeCollidables();
    } else {
      this.addCollidables(State.get(race).groupHandlersArr);
    }

  }
};

ActiveGroupHandler.prototype.addCollidables = function (handlers) {
  this.handlerList = handlers;
};

ActiveGroupHandler.prototype.removeCollidables = function () {
  this.handlerList = [];
};

module.exports = ActiveGroupHandler;