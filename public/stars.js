window.CS = window.CS || {};
CS.stars = CS.stars || {};

var x_spread = 10000,
    y_spread = 2000,
    z_spread = 1000;

CS.stars.drawParticles = function(){
  // create the particle variables
  CS.stars.particleCount = 3800,
  CS.stars.particles = new THREE.Geometry(),
  CS.stars.material =
        new THREE.ParticleBasicMaterial({
          color: 0xFFFFFF,
          size: 20,
          map: THREE.ImageUtils.loadTexture(
            "textures/particle.png"
          ),
          blending: THREE.AdditiveBlending,
          transparent: true
        });

  // now create the individual CS.stars.particles
  for(var p = 0; p < CS.stars.particleCount; p++) {

    // create a particle with random
    // position values, -250 -> 250
    var pX = Math.random() * x_spread - x_spread/2,
        pY = Math.random() * y_spread - y_spread/2,
        pZ = Math.random() * z_spread - z_spread,
        particle = new THREE.Vertex(
          new THREE.Vector3(pX, pY, pZ)
        );

    // add it to the geometry
    // create a velocity vector
    particle.velocity = new THREE.Vector3(-Math.random()*.5,0,0);
    CS.stars.particles.vertices.push(particle);
  }


  // create the particle system
  CS.stars.particleSystem =
    new THREE.ParticleSystem(
      CS.stars.particles,
      CS.stars.material);

   // also update the particle system to
  // sort the CS.stars.particles which enables
  // the behaviour we want
  CS.stars.particleSystem.sortParticles = true;

  // add it to the scene
  CS.scene.add(CS.stars.particleSystem);

};

CS.stars.animation = function (){
  var pCount = CS.stars.particleCount;
  while(pCount--) {
    // get the particle
    var particle = CS.stars.particles.vertices[pCount];

    // check if we need to reset
    if(particle.x < -x_spread/2) {
      particle.x = x_spread/2;
      particle.velocity.x = 0;
    }

    // update the velocity with
    // a splat of randomniz
    particle.velocity.x -= Math.random() * .05;

    // and the position
    particle.x += particle.velocity.x;
  }

  // flag to the particle system
  // that we've changed its vertices.
  CS.stars.particleSystem.geometry.__dirtyVertices = true;
};