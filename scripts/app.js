(function(window) {
  // Get a reference to the SDK, but alias it to a module local variable so that
  // there will never be any future global name collisions on the name secondscreenHost
  var secondscreenHost = window.secondscreenHost.noConflict();

  // Disable logging, turn it on for more information on the state of
  // the system
  secondscreenHost.setLogLevel(secondscreenHost.LogLevels.NONE);

  // Start the second screen service. This starts the process of connecting to
  // the Red5Pro Registry service to make an instance of an app disoverable by
  // the mobile app
  secondscreenHost.start({
    // This is the name that will be displayed in the list on the mobile app
    // that users use to choose which host app to connect to
    name: "Multi Draw",

    // No more than 10 players can connect.
    maxPlayers: 10,

    // This is the legacy Brass Monkey registry. It is now possible
    // to self host your own registry server via a Red5Pro subscription
    // or to use the hosted Red5Pro service
    registryUrl: "ws://162.242.210.105:6262/secondscreen",
    //registryUrl: "ws://localhost:6262/secondscreen",

    appId: "Multi Draw",
    swfobjectUrl: 'scripts/red5pro/swf/swfobject.js',
    swfUrl: "scripts/red5pro/swf/secondscreenHost.swf",

    minimumVersion: {
      major: 0,
      minor: 0
    },

    // Set the controller mode to use HTML based controls. There are some
    // other simple built in controllers. See the Red5Pro Second Screen HTML5
    // documentation for more details
    controlMode: secondscreenHost.ControlModes.HTML,

    // Specify the url of our HTML5 based controller. To make sure we don't
    // have caching issues with the controller, we add a random parameter to
    // prevent caching
    controlsUrl: "controller/controller.html?cachebust=" + (new Date().getTime()),


    error: function(error) {
      // The SDK failed to connect to the registry servers.
      // TODO: Recommend a recovery strategy for that case. I'm not sure if
      // there are automatic retries. Will need to research further
      secondscreenHost.log.error('Registry connection error: ' + error);
    },
    success: function() {
      // The SDK successfully connected to the registry servers
      secondscreenHost.log.info('Registry connected.');
    }
  });

  secondscreenHost.on(secondscreenHost.EventTypes.SHOW_SLOT_COLOR, function(e) {
    // We received the slot color from the registry servers. This is used
    // to disambiguate when connecting to an app when there are multiple instances
    // of the same app
      // We visualize this so users can see it
    var slot = document.getElementById('slot');
    slot.style.background = e.color;
  });

  function showDrawing(drawingMode){
    if (drawingMode) {
      document.getElementById('draw-mode').style.display = 'block';
      document.getElementById('instructions-mode').style.display = 'none';
    } else {
      document.getElementById('draw-mode').style.display = 'none';
      document.getElementById('instructions-mode').style.display = 'block';
    }
  }
  showDrawing(false);

  secondscreenHost.on(secondscreenHost.EventTypes.DEVICE_CONNECTED, function (e){
    // A controller connected
    showDrawing(true);
  });

  secondscreenHost.on(secondscreenHost.EventTypes.DEVICE_DISCONNECTED, function (e){
    // A controller disconnected
    showDrawing(false);
  });

  secondscreenHost.on(secondscreenHost.EventTypes.CONTROLS_URL_CHANGE, function(e) {
    // Not sure when this is called
  });

  // Listen for messages from the controller app
  secondscreenHost.on(secondscreenHost.EventTypes.MESSAGE, function(e) {
    if( e.message === 'line' ) {
      drawing.renderer.line(
        e.state.x0,
        e.state.y0,
        e.state.x1,
        e.state.y1,
        e.state.color,
        e.state.brushSize );
    }
  });

  // Create an Drawing instance. Make it global for easier hacking in the
  // javascript console.
  drawing = new Drawing();

  // Uncomment this to add a utilify function notifyClient() that sends a message
  // to all connected clients.
  /*
  window.notifyClient = function(message) {
    secondscreenHost.allDevices().sendMessageToControls("state", encodeURIComponent(JSON.stringify({state:'host-available', message:message})));
  };
  */
}(window));
