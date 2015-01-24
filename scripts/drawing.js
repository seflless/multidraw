/*
 * drawing.js - Implements a light wrapper around the canvas element's drawing
 *              API
 *
 */
(function(){

function Drawing(id, width, height) {
  this.el = document.getElementById(id);

  this.ctx = this.el.getContext('2d');

  this.width = width;
  this.height = height;
  this.el.width = width;
  this.el.height = height;
}

Drawing.prototype.clear = function(color){
  this.ctx.fillStyle = color;
  this.ctx.fillRect(0, 0, this.width, this.height);
}

Drawing.prototype.line = function(x0, y0, x1, y1, color){
  this.ctx.strokeStyle = color;
  this.ctx.beginPath();
  this.ctx.moveTo(Math.floor(x0), Math.floor(y0));
  this.ctx.lineTo(Math.floor(x1), Math.floor(y1));
  this.ctx.stroke();
}

  // Make drawing interface globally accessible
window.Drawing = Drawing;

})(window)
