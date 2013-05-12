window.CS = window.CS || {};
CS.player = CS.player || {};

CS.player.material = THREE.MeshFaceMaterial;//({color: 0xCC0000});

CS.player.geometry = THREE.CubeGeometry;
CS.player.position = {x: 0, y: 0, z: 0.5};
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


CS.player.add_to_trail = function(){
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


CS.player.init_trail = function(){
  for (var i=0;i<trail_length;i++) {
    CS.player.add_to_trail();
  }
}

CS.player.update_trail = function(){
  for (var i=0;i<trail_length;i++) {
    var tail_frame = CS.player.trail[i];
    for (var j=0;j<10;j++) {
      var particle = tail_frame.vertices[j];
      if (i==current_tail){
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
  if (current_tail==trail_length) {
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

// Rays in each direction for ray casting collisions
var w = 10;
CS.player.rays = [
  new THREE.Vector3(w, 0, 0), // R
  new THREE.Vector3(0, w, 0), // U
  new THREE.Vector3(-w, 0, 0), // L
  new THREE.Vector3(0, -w, 0), // D
];

CS.player.caster = new THREE.Raycaster();

CS.player.collision = function () {
  var RIGHT = 0,
      UP    = 1,
      LEFT  = 2,
      DOWN  = 3;
  var collisions, i,
      distance = CS.UNIT;
      obstacles = CS.level1.meshes;
  var any_collisions = false;
  for (i = 0; i < this.rays.length; i += 1) {
    this.caster.set(this.mesh.position, this.rays[i]);
    collisions = this.caster.intersectObjects(obstacles);
    if (collisions.length > 0){
      if (collisions[0].distance <= distance) {
        any_collisions = true;
        CS.player.inAir = false;
        if (i == DOWN){
          this.falling = false;
          this.direction.y = 0;
          this.mesh.rotation.z = 0;
          this.mesh.position.y += (distance - collisions[0].distance - 4);
        }
        else if (i == UP){
          if (!this.falling){
            this.direction.y *= -1;
          } else {
            this.falling = false;
            this.direction.y = 0;
            this.mesh.position.y += 2*CS.UNIT + (collisions[0].distance - distance) + 1;
          }
        }
        else { this.direction.x *= -1; }
      }
     }
  }
  if (!any_collisions){
    CS.player.inAir = true;
  }
}
