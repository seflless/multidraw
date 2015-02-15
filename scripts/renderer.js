/*
 * drawing.js - Implements a light wrapper around the canvas element's drawing
 *              API
 *
 */
(function(){

function Renderer(id, containerId, width, height, unthrottledDrawing) {
  var self = this;

  // If this is provided and set to true, drawing is not throttled
  // per requestAnimationFrame
  this.unthrottledDrawing = unthrottledDrawing;

  this.container = document.getElementById(containerId);
  this.el = document.getElementById(id);

  this.ctx = this.el.getContext('2d');

  this.ctx.lineCap = 'round';
  this.ctx.lineJoin = 'round';

  this.width = width;
  this.height = height;
  this.el.width = width;
  this.el.height = height;

  // SVG pre-drawer:
  // For unintuitive reasons, drawing SVG lines is faster than using the canvas
  // element, so we use svg lines for quicker feedback, and then
    // Create and attach svg element. This code assumes that there are css
    // attributes that will make the svg element overlay the canvas one.
  this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  this.svg.setAttribute('width', this.width);
  this.svg.setAttribute('height', this.height);
  this.container.appendChild(this.svg);
    // We'll be keeping a window of history of the recent svg lines added
    // this is so we can remove old ones after too many are active
  this.svgLines = [];
  this.maxSvgLines = 40;

  // Draw Command Buffers
    // Only the last clear is done
  this.lastClear = null;
  this.lines = [];

  // Listen for resize events to center the drawing canvas. NOTE: The body element
  // should be set to clip everything to prevent scrolling.
  function resize() {
    self.container.style.marginLeft = Math.floor( (window.innerWidth-self.width) / 2 ) + 'px';
    self.container.style.marginTop = Math.floor( (window.innerHeight-self.height) / 2 ) + 'px';
  }
  window.addEventListener('resize', resize);
  // Call resize to set the initial layout
  resize();

  // Listen for requestAnimationFrames so we draw at the right time.
  var skipFrames = 1,
      counter = 0;
  function render(timeStamp){
    counter += 1;
    if( counter % skipFrames === 0) {
      if(self.lastClear) {
        clearInternal(self, self.lastClear );
        self.lastClear = null;
      }

      if(self.lines.length) {
        linesInternal(self, self.lines );
      }
    }

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

Renderer.prototype.clear = function(color){
  this.lastClear = color;
}

Renderer.prototype.line = function(x0, y0, x1, y1, color, thickness){
  svgLine(this, x0, y0, x1, y1, color, thickness);
  this.lines.push({x0: x0, y0: y0, x1: x1, y1: y1, color: color, thickness: thickness});
}

function svgLine(renderer, x1, y1, x2, y2, color, thickness){

  var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', x1);
  line.setAttribute('y1', y1);
  line.setAttribute('x2', x2);
  line.setAttribute('y2', y2);
  line.setAttribute('stroke', color);
  line.setAttribute('stroke-width', thickness);

  renderer.svg.appendChild(line);

  // Keep a window of history of svg lines created. Never have more than
  // maxLines
  renderer.svgLines.push(line);

  if( renderer.svgLines.length>=renderer.maxSvgLines ){
    renderer.svg.removeChild(renderer.svgLines.shift());
  }
}


function linesInternal(renderer, lines){
  var color,
      thickness,
      x, y,
      linesPerFrame = Math.min(renderer.unthrottledDrawing === true? 100000 : 10, lines.length),
      i, line;

  for(var i = 0; i<linesPerFrame; i++) {
    line = lines.shift();

    // It's a new line if any of the properties have changed (Or it's the first line)
    if(line.color !== color || line.thickness !== thickness) {
      // Close previous one if there was one
      if(color !== undefined && thickness !== undefined){
        renderer.ctx.stroke();
      }

      // Start new path
      color = renderer.ctx.strokeStyle = line.color;
      thickness = renderer.ctx.lineWidth = line.thickness;
      renderer.ctx.beginPath();
      renderer.ctx.moveTo(Math.floor(line.x0), Math.floor(line.y0));
      renderer.ctx.lineTo(Math.floor(line.x1), Math.floor(line.y1));

      // Store the last x/y position for later
      x = line.x1;
      y = line.y1;
    }
    // If this line segment has the same color/thickness then add to the path
    else if(line.color === color && line.thickness === thickness ) {
      // Make sure this new line starts where the previous one ended. If not
      // moveTo it to create the necessary gap
      if( line.x0 !== x || line.y0 !== y) {
        renderer.ctx.moveTo(Math.floor(line.x0), Math.floor(line.y0));
      }

      renderer.ctx.lineTo(Math.floor(line.x1), Math.floor(line.y1));

      x = line.x1;
      y = line.y1;
    }
  }

  renderer.ctx.stroke();
}

function clearInternal(renderer, color){
  renderer.ctx.fillStyle = color;
  renderer.ctx.fillRect(0, 0, renderer.width, renderer.height);
}

  // Make drawing interface globally accessible
window.Renderer = Renderer;

})(window)
