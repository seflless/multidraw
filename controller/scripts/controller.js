/*global window, document*/
(function(window, document) {

  var secondscreenClient = window.secondscreenClient.noConflict();

  drawing = new Drawing(function(x0, y0, x1, y1, color, brushSize){
    secondscreenClient.send('line', {
      x0: x0,
      y0: y0,
      x1: x1,
      y1: y1,
      color: color,
      brushSize: brushSize
    });
  });

  drawing.renderer.el.addEventListener('touchstart', function(){
    // Send a 'jump' message when the button is touched
    secondscreenClient.send('jump');
  })

  secondscreenClient.on('test', function(data) {
    // Respond to a 'test' message
    // TODO: Send a 'test' message from the host app
  });

}(window, document));
