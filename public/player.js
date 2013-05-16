window.CS = window.CS || {};
CS.player = CS.player || {};

CS.player.geometry = THREE.CubeGeometry;
CS.player.position = {x: 0, y: -10, z: 0.5};
CS.player.facing = 'right';
CS.player.direction = {x: 0, y: 0, z: 0};
CS.player.weight = 10;
CS.player.inAir = false;
CS.player.falling = false;
CS.player.heightInAir = 0;

CS.player.trail = [];
CS.player.trailS = [];
var current_tail = 0,
    trail_length = 60;


CS.player.addParticlesToTrail = function(){
  var particleCount = 10,
      particles = new THREE.Geometry(),
      pMaterial = CS.Shaders.TRAIL;

  for(var p = 0; p < particleCount; p++) {
    var pX = CS.player.mesh.position.x + Math.random() * 10 - 5,
        pY = CS.player.mesh.position.y + Math.random() * 5,
        pZ = CS.player.mesh.position.z + Math.random() * 12 - 15,
        particle = new THREE.Vertex(new THREE.Vector3(pX, pY, pZ));
    particles.vertices.push(particle);
  }
  CS.player.trail.push(particles);

  var particleSystem = new THREE.ParticleSystem(particles, pMaterial);
  particleSystem.sortParticles = true;
  CS.player.trailS.push(particleSystem);
  CS.scene.add(particleSystem);
};


CS.player.initTrail = function(){
  for (var i = 0; i < trail_length; i++) {
    CS.player.addParticlesToTrail();
  }
}

CS.player.updateTrail = function(){
  for (var i = 0; i < trail_length; i++) {
    var tail_frame = CS.player.trail[i];
    for (var j = 0; j < 10; j++) {
      var particle = tail_frame.vertices[j];
      if (i === current_tail){
        particle.x = CS.player.mesh.position.x + Math.random() * 10 - 5,
        particle.y = CS.player.mesh.position.y + Math.random() * 10 - 5,
        particle.z = CS.player.mesh.position.z + Math.random() * 8 - 4;
      }
      else {
        cons = (Math.abs(CS.player.mesh.position.x - particle.x) + Math.abs(CS.player.mesh.position.y - particle.y))/12;
        particle.x += cons*(Math.random()/2 - Math.random()/2),
        particle.y += cons*(Math.random()/2 - Math.random()/2);
      }
    }
    CS.player.trailS[i].geometry.__dirtyVertices = true;
  }
  current_tail += 1;
  if (current_tail === trail_length) {
    current_tail = 0;
  }
};

CS.player.stop = function(){
  if (!CS.player.inAir){
    CS.player.direction.x = 0;
  }
};
CS.player.speed = 2.2;

CS.player.handleKeys = function(){

  KeyboardJS.on('d', function(){
    CS.player.direction.x = CS.player.speed;
    CS.player.facing = 'right';
  }, this.stop);

  KeyboardJS.on('a', function(){
    CS.player.direction.x = -CS.player.speed;
    CS.player.facing = 'left';
  }, this.stop);

  KeyboardJS.on('w', function(){
    if (!CS.player.inAir){
      CS.player.direction.y = 7;
      if (CS.player.facing == 'left'){
        CS.player.mesh.rotation.z += 0.5;
      } else {
        CS.player.mesh.rotation.z -= 0.5;
      }
    }
  }, this.stop);

  KeyboardJS.on('s', function(){
    if (CS.player.inAir){
      CS.player.direction.y = -10;
    }
  }, this.stop);

  if (KeyboardJS.activeKeys().length == 0){
    CS.player.direction.x = 0;
  }
};

CS.player.gravity = function(){
  this.direction.y -= this.weight * CS.gravity;
  if (Math.abs(CS.player.mesh.rotation.z) >= 0.1){
    if (CS.player.facing == 'left'){
      CS.player.mesh.rotation.z -= 0.1;
    } else {
      CS.player.mesh.rotation.z += 0.1;
    }
  }
  if (this.direction.y < 0){
    this.falling = true;
  }
};

CS.player.move = function(){
  CS.player.handleKeys();

  if (CS.player.inAir){
    CS.player.gravity();
  }

  var x = CS.player.direction.x,
      y = CS.player.direction.y
  CS.player.mesh.position.x += x;
  CS.player.mesh.position.y += y;
};

CS.player.collision = function () {
  CS.collision_detector.detect(CS.player);
};

