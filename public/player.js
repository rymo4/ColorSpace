window.CS = window.CS || {};
CS.player = CS.player || {};

CS.player.material = THREE.MeshFaceMaterial;//({color: 0xCC0000});
CS.player.geometry = THREE.SphereGeometry;
CS.player.position = {x: 0, y: -2, z: 0};
CS.player.direction = {x: 0, y: -1, z: 0};
CS.player.move = function(){


  var stop = function(){CS.player.direction.x = 0}
  KeyboardJS.on('d', function(){ CS.player.direction.x = 1 }, stop)
  KeyboardJS.on('a', function(){ CS.player.direction.x = -1 }, stop)


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
  var collisions, i,
  distance = CS.UNIT,
  obstacles = CS.level1.meshes;
  for (i = 0; i < this.rays.length; i += 1) {
    this.caster.set(this.mesh.position, this.rays[i]);
    collisions = this.caster.intersectObjects(obstacles);
    if (collisions.length > 0 && collisions[0].distance <= distance) {
      this.direction.y *= -1;
      // TODO: use this.rays to change the direction correctly
    }
  }
}
