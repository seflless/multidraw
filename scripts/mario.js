(function(){
  var gravity = 900.0,
      jumpImpulse = 300.0,
      mario = {
        // Initial state
        state: 'standing',
        position: {
          x: 0,
          y: 0
        },
        velocity: {
          x: 0,
          y: 0
        },
        el: document.getElementById('mario'),
        shadowEl: document.getElementById('mario-shadow'),

        // Actions
        jump: function (){
          // Ignore if we're already jumping or falling
          /*
          if( mario.state === 'jumping' ) {
            return;
          }
          */
          mario.velocity.y += jumpImpulse;
          mario.state = 'jumping';
        }
      };

  // Make the mario object globally accessible
  window.mario = mario;

  // For debuggin purposes we make it so that clicking on a mario makes him jump too
  mario.el.addEventListener('mousedown', function(){
    mario.jump();
  });

  // Start a simple game loop that updates mario based on his state
  // TODO: Move this to requestAnimationFrame
  var lastUpdate = (new Date()).getTime();
  setInterval(function(){
    // Calculate how much time has changed since the last run of the loop
    var newTime = (new Date()).getTime(),
        deltaTime = (newTime-lastUpdate)/1000; // In seconds
    lastUpdate = newTime;

    // Apply velocity
    mario.position.x += mario.velocity.x*deltaTime;
    mario.position.y += mario.velocity.y*deltaTime;

    // Apply gravity
    if(mario.state === 'jumping') {
      mario.velocity.y -= gravity*deltaTime;
    }

    // Check if we've landed on the ground yet if we're jumping
    if( mario.state === 'jumping' &&
        mario.position.y<= 0.0 ) {

      mario.state = 'standing';

      // Snap to ground
      mario.position.y = 0;

      // Clear all velocity
      mario.velocity.x = 0;
      mario.velocity.y = 0;
    }

    // Update the mario element to match mario's position
    mario.el.style.top = '-' + Math.floor(mario.position.y) + 'px';

    // Update the shadow too
    var coefficient = Math.max(0.0, Math.min(1.0, 1.0-mario.position.y/50))*0.2;
    mario.shadowEl.style.opacity = coefficient;
    mario.shadowEl.style.width = Math.floor((1-coefficient)*16 + 44) + 'px';
  }, 1000/60)



})(window)
