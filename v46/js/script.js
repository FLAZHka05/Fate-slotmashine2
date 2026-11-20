// HTML element that  contain the PixiJS vanva
const stage = document.getElementById('stage');

// eror handling 
if (!stage) {
  console.error('The #stage element was not found.');
} else {
  // Create the PixiJS setup 
  const app = new PIXI.Application({
    resizeTo: stage,
    background: '#000000',
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });

  // Add the PixiJS canvas to the HTML element
  stage.appendChild(app.view);

  // Create a green outline 
  const border = new PIXI.Graphics();
  border.lineStyle(2, 0x00ff55, 1);
  border.drawRect(0, 0, stage.clientWidth, stage.clientHeight);
  app.stage.addChild(border);

  // Store particle objects so they can be updated on each animation frame.
  const particles = [];
  // Limit the animation to this number of particles.
  const maxParticles = 60;

  // Create one particle with a random starting position and movement properties.
  function makeParticle() {
    // Draw a small, semi-transparent green circle for the particle.
    const circle = new PIXI.Graphics();
    circle.beginFill(0x00ff55, 0.18);
    circle.drawCircle(0, 0, 2 + Math.random() * 4);
    circle.endFill();

    // randomazing  position within the stage.
    const x = Math.random() * stage.clientWidth;
    const y = Math.random() * stage.clientHeight;
    // randomizing the particle's movement, speed, directional and  drift.
    const speed = 0.3 + Math.random() * 0.9;
    const drift = (Math.random() - 0.5) * 0.5;

    // start ponint of circle 
    circle.x = x;
    circle.y = y;

    // draws the circle inside the canba 
    app.stage.addChild(circle);
    // circle and its animation state saves  .
    particles.push({ circle, speed, drift, angle: Math.random() * Math.PI * 2 });
  }

  // loop runs once for each particle to be created.`ds
  for (let i = 0; i < maxParticles; i++) {
    makeParticle();
  }

  //  pointer target at the center of the stage from the start.
  let pointer = { x: stage.clientWidth / 2, y: stage.clientHeight / 2 };

  // Track pointer movement and while convering the pointer cords to stage cords 
  stage.addEventListener('pointermove', (event) => {
    const rect = stage.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
  });

  // Reset the pointer target to the ecter of the canva
  stage.addEventListener('pointerdown', () => {
    pointer.x = stage.clientWidth / 2;
    pointer.y = stage.clientHeight / 2;
  });

  // animation on each PixiJS ticker frame.
  app.ticker.add(() => {
    // Update every particle's direction and position.
    for (const item of particles) {
      // Change the cords and direction
      item.angle += 0.01 + item.drift;
      item.circle.x += Math.cos(item.angle) * item.speed;
      item.circle.y += Math.sin(item.angle) * item.speed;

      // searches for  the vector and distance from this particle to the pointer target.
      const dx = pointer.x - item.circle.x;
      const dy = pointer.y - item.circle.y;
      //  1 if the distance is zero to avoid dividing by zero below.
      const distance = Math.hypot(dx, dy) || 1;

      // If range is < 120 pixels, pull it slightly toward the pointer.
      if (distance < 120) {
        //  Strength of the particle's movement to the  pointer.
        const pull = 0.25;
        item.circle.x += (dx / distance) * pull;
        item.circle.y += (dy / distance) * pull;
      }

      // If the particle has crossed a horizontal edge and reverse it.
      if (item.circle.x < 0 || item.circle.x > stage.clientWidth) {

        item.circle.x = Math.max(0, Math.min(stage.clientWidth, item.circle.x));
        // Reverse travel direction so the particle moves back into the stage.
        item.angle += Math.PI;
      }

      // If the particle has crossed a vertical edge and reverse it.
      if (item.circle.y < 0 || item.circle.y > stage.clientHeight) {
        
        item.circle.y = Math.max(0, Math.min(stage.clientHeight, item.circle.y));
       
        item.angle += Math.PI;
      }
    }

    // Redraws border  
    border.clear();
    border.lineStyle(2, 0x00ff55, 1);
    border.drawRect(0, 0, stage.clientWidth, stage.clientHeight);
  });

  // Resize the PixiJS
  window.addEventListener('resize', () => {
    app.renderer.resize(stage.clientWidth, stage.clientHeight);
  });
}
