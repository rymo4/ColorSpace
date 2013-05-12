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
  new THREE.Vector3(0, 0, w), // Out
  new THREE.Vector3(0, 0, -w) // In
];

CS.player.caster = new THREE.Raycaster();

CS.player.collision = function () {
  var RIGHT = 0,
      UP    = 1,
      LEFT  = 2,
      DOWN  = 3,
      IN    = 5,
      OUT   = 4;
  var collisions,
      distance = CS.UNIT,
      obstacles = CS.level1.meshes;
  var any_collisions = false;
  for (var i = 0; i < this.rays.length; i += 1) {
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
        //for (var j = 0; j < collisions.length; j+= 1){
        //  collision[j].p
        ///}
      }
    }
  }
  if (!any_collisions){
    CS.player.inAir = true;
  }
};

