window.CS = window.CS || {};
CS.player = CS.player || {};

CS.player.material = THREE.MeshFaceMaterial;//({color: 0xCC0000});


//Character model
var torso = new THREE.Mesh(new THREE.CubeGeometry(8, 10, 8));

var neck = new THREE.Mesh(new THREE.CubeGeometry(3, 4, 3));
neck.position.y = torso.position.y + 6;

var head = new THREE.Mesh(new THREE.SphereGeometry(5, 5, 5));
head.position.y = neck.position.y + 5;

var r_arm = new THREE.Mesh(new THREE.CubeGeometry(3, 7, 2));
r_arm.position.z = torso.position.z + 10;
r_arm.position.y = torso.position.y + 1;
r_arm.position.x = torso.position.x - 2;
r_arm.rotation.z = -Math.PI/3;

var l_arm = new THREE.Mesh(new THREE.CubeGeometry(3, 7, 2));
l_arm.position.z = torso.position.z - 10;
l_arm.position.y = torso.position.y + 1;
l_arm.position.x = torso.position.x + 2;
l_arm.rotation.z = Math.PI/3;

var l_leg = new THREE.Mesh(new THREE.CubeGeometry(3, 8, 3));
l_leg.position.z = torso.position.z - 3;
l_leg.position.y = torso.position.y - 6;
l_leg.position.x = torso.position.x - 3;
l_leg.rotation.z = -Math.PI/3;

var r_leg = new THREE.Mesh(new THREE.CubeGeometry(3, 8, 3));
r_leg.position.z = torso.position.z + 3;
r_leg.position.y = torso.position.y - 6;
r_leg.position.x = torso.position.x + 3;
r_leg.rotation.z = Math.PI/3;

var geo = new THREE.Geometry();
THREE.GeometryUtils.merge(geo, torso);
THREE.GeometryUtils.merge(geo, neck);
THREE.GeometryUtils.merge(geo, head);
THREE.GeometryUtils.merge(geo, r_arm);
THREE.GeometryUtils.merge(geo, l_arm);
THREE.GeometryUtils.merge(geo, l_leg);
THREE.GeometryUtils.merge(geo, r_leg);
geo.computeBoundingSphere();
CS.player.geometry = geo;

CS.player.position = {x: 0, y: -6.5, z: 0};
CS.player.facing = 'right';
CS.player.direction = {x: 0, y: 0, z: 0};
CS.player.weight = 10;
CS.player.handleKeys = function(){
  var stop = function(){CS.player.direction.x = 0 };
  KeyboardJS.on('d', function(){ 
    CS.player.direction.x = 1; 
    if (CS.player.facing == 'left') {
      //CS.player.mesh.rotation.y = -Math.PI;
      CS.player.facing = 'right';
    }
  }, stop);
  KeyboardJS.on('a', function(){ 
    CS.player.direction.x = -1; 
    if (CS.player.facing == 'right') {
      //CS.player.mesh.rotation.y = Math.PI;
      CS.player.facing = 'left';
    }
  }, stop);
  KeyboardJS.on('w', function(){
    if (CS.player.direction.y === 0){
      CS.player.direction.y = 7;
    }
  }, stop);
};

CS.player.fall = function(){
  this.direction.y -= this.weight * CS.gravity;
};

CS.player.move = function(){
  CS.player.handleKeys();

  if (CS.player.inAir){ CS.player.fall(); }

  var x = CS.player.direction.x,
      y = CS.player.direction.y
      z = CS.player.direction.z;
  CS.player.position.x += x;
  CS.player.position.y += y;
  CS.player.position.z += z;
  CS.player.mesh.position.x += x;
  CS.player.mesh.position.y += y;
  CS.player.mesh.position.z += z;
};

// Rays in each direction for ray casting collisions
var w = 1;
CS.player.rays = [
  new THREE.Vector3(w, 0, 0), // R
  //new THREE.Vector3(w, w, 0), // RU
  new THREE.Vector3(0, w, 0), // U
  //new THREE.Vector3(-w, w, 0), // UL
  new THREE.Vector3(-w, 0, 0), // L
  //new THREE.Vector3(-w, -w, 0), // LD
  new THREE.Vector3(0, -w, 0), // D
  //new THREE.Vector3(w, -w, 0), // DR
];

CS.player.caster = new THREE.Raycaster();

CS.player.collision = function () {
  var RIGHT = 0,
      UP = 1,
      LEFT = 2,
      DOWN = 3;
  var collisions, i,
      distance = CS.UNIT,
      obstacles = CS.level1.meshes;
  var any_collisions = false;
  for (i = 0; i < this.rays.length; i += 1) {
    this.caster.set(this.mesh.position, this.rays[i]);
    collisions = this.caster.intersectObjects(obstacles);
    if (collisions.length > 0 && collisions[0].distance <= distance) {
      any_collisions = true;
      CS.player.inAir = false;
      if (i == DOWN){ this.direction.y = 0; }
      else if (i == UP){ this.direction.y *= -1; }
      else {this.direction.x *= -1; }
      // TODO: use this.rays to change the direction correctly
    }
  }
  if (!any_collisions){
    CS.player.inAir = true;
  }
}
