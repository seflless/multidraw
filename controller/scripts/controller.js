/*global window, document*/
(function(window, document) {
  'use strict';

  var secondscreenClient = window.secondscreenClient.noConflict(),
      jumpButton = document.getElementById('jump');

  // Send a 'jump' message when the button is touched
  jumpButton.addEventListener('touchstart', function(){
    secondscreenClient.send('jump');
  });

  secondscreenClient.on('test', function(data) {
    // Respond to a 'test' message
    // TODO: Send a 'test' message from the host app
  });

}(window, document));
