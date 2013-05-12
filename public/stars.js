window.CS = window.CS || {};
CS.stars = CS.stars || {};

var x_spread = 10000,
    y_spread = 2000,
    z_spread = 1000;

CS.stars.drawParticles = function(){
  CS.stars.particleCount = 3800,
  CS.stars.particles = new THREE.Geometry(),
  CS.stars.material = CS.Shaders.STARS;

  for(var p = 0; p < CS.stars.particleCount; p++) {

    var pX = Math.random() * x_spread - x_spread/2,
        pY = Math.random() * y_spread - y_spread/2,
        pZ = Math.random() * z_spread - z_spread,
        particle = new THREE.Vertex(
          new THREE.Vector3(pX, pY, pZ)
        );

    particle.velocity = new THREE.Vector3(-Math.random()*.5,0,0);
    CS.stars.particles.vertices.push(particle);
  }

  CS.stars.particleSystem = new THREE.ParticleSystem(CS.stars.particles, CS.stars.material);

  CS.stars.particleSystem.sortParticles = true;
  CS.scene.add(CS.stars.particleSystem);

};

CS.stars.animation = function (){
  var pCount = CS.stars.particleCount;
  while(pCount--) {
    var particle = CS.stars.particles.vertices[pCount];

    if(particle.x < -x_spread/2) {
      particle.x = x_spread/2;
      particle.velocity.x = 0;
    }

    particle.velocity.x -= Math.random() * .05;
    particle.x += particle.velocity.x;
  }

  CS.stars.particleSystem.geometry.__dirtyVertices = true;
};