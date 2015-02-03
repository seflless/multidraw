/*
* drawing.js - Implements a light wrapper around the canvas element's drawing
*              API
*
*/
(function(){

  function Drawing(onLineCB) {
    var self = this;

    this.onLineCB = onLineCB;

    this.renderer = new Renderer('drawing', 2000, 2000);
    this.renderer.clear('white');

    this.color = 'black';
    this.brushSize = 2.0;

    var lastTouch = {};

    function localCoordinates(touch){
      var x,y;
      if (touch.pageX || touch.pageY) {
        x = touch.pageX;
        y = touch.pageY;
      }
      else {
        x = touch.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = touch.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }
      x -= self.renderer.el.offsetLeft;
      y -= self.renderer.el.offsetTop;

      return { x: x, y: y };
    }

    this.renderer.el.addEventListener('touchstart',function(e){
      for(var i = 0; i<e.changedTouches.length; i++) {
        lastTouch[e.changedTouches[i].identifier] = localCoordinates(e.changedTouches[i]);
      }
      e.preventDefault();
    }, false);
    this.renderer.el.addEventListener('touchmove',function(e){
      for(var i = 0; i<e.changedTouches.length; i++) {
        // Make sure we are tracking this touch
        if( typeof lastTouch[e.changedTouches[i].identifier] === 'undefined' ) {
          return;
        }

        var newPosition = localCoordinates(e.changedTouches[i]);
        self.line(
          lastTouch[e.changedTouches[i].identifier].x,
          lastTouch[e.changedTouches[i].identifier].y,
          newPosition.x,
          newPosition.y,
          self.color,
          self.brushSize );

        // Update last touch
        lastTouch[e.changedTouches[i].identifier] = newPosition;
      }
      e.preventDefault();
    }, false);
    this.renderer.el.addEventListener('touchend',function(e){
      for(var i = 0; i<e.changedTouches.length; i++) {
        // Make sure we are tracking this touch
        if( typeof lastTouch[e.changedTouches[i].identifier] === 'undefined' ) {
          return;
        }

        // Remove from touch list
        delete lastTouch[e.changedTouches[i].identifier];
      }
      e.preventDefault();
    }, false);
    this.renderer.el.addEventListener('touchcancel',function(e){
      // Clear all the touches
      lastTouch = {};
    }, false);
  }

  Drawing.prototype.line = function(x0, y0, x1, y1, color, brushSize){
    if(typeof this.onLineCB === 'function') {
      this.onLineCB(x0, y0, x1, y1, color, brushSize);
    }

    this.renderer.line(x0, y0, x1, y1, color, brushSize);
  }

  window.Drawing = Drawing;

})(window)
