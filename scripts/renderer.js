/*
 * drawing.js - Implements a light wrapper around the canvas element's drawing
 *              API
 *
 */
(function(){

function Renderer(id, width, height) {
  var self = this;

  this.el = document.getElementById(id);

  this.ctx = this.el.getContext('2d');

  this.ctx.lineCap = 'round';
  this.ctx.lineJoin = 'round';

  this.width = width;
  this.height = height;
  this.el.width = width;
  this.el.height = height;

  // Listen for resize events to center the drawing canvas. NOTE: The body element
  // should be set to clip everything to prevent scrolling.
  function resize() {
    self.el.style.marginLeft = Math.floor( (window.innerWidth-self.width) / 2 ) + 'px';
    self.el.style.marginTop = Math.floor( (window.innerHeight-self.height) / 2 ) + 'px';
  }
  window.addEventListener('resize', resize);
  // Call resize to set the initial layout
  resize();
}

Renderer.prototype.clear = function(color){
  this.ctx.fillStyle = color;
  this.ctx.fillRect(0, 0, this.width, this.height);
}

Renderer.prototype.line = function(x0, y0, x1, y1, color, thickness){
  this.ctx.strokeStyle = color;
  this.ctx.lineWidth = thickness;

  this.ctx.beginPath();
  this.ctx.moveTo(Math.floor(x0), Math.floor(y0));
  this.ctx.lineTo(Math.floor(x1), Math.floor(y1));
  this.ctx.stroke();
}

  // Make drawing interface globally accessible
window.Renderer = Renderer;

})(window)
