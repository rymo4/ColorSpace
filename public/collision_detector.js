window.CS = window.CS || {};
CS.collision_detector = CS.collision_detector || {};

// Rays in each direction for ray casting collisions
var w = 10;
CS.collision_detector.rays = [
  new THREE.Vector3(w, 0, 0), // R
  new THREE.Vector3(0, w, 0), // U
  new THREE.Vector3(-w, 0, 0), // L
  new THREE.Vector3(0, -w, 0)//, // D
  //new THREE.Vector3(0, 0, w), // Out
  //new THREE.Vector3(0, 0, -w) // In
];

CS.collision_detector.caster = new THREE.Raycaster();

CS.collision_detector.detect = function (object) {
  var RIGHT = 0,
      UP    = 1,
      LEFT  = 2,
      DOWN  = 3,
      IN    = 5,
      OUT   = 4;
  var collisions,
      distance = CS.UNIT,
      obstacles = CS.level.meshes;
  var any_collisions = false;
  for (var i = 0; i < CS.collision_detector.rays.length; i += 1) {
    CS.collision_detector.caster.set(object.mesh.position, CS.collision_detector.rays[i]);
    collisions = CS.collision_detector.caster.intersectObjects(obstacles);
    if (collisions.length > 0){
      if (i == DOWN && collisions[0].distance <= distance){
        any_collisions = true;
        object.inAir = false;
        CS.collision_detector.adjust_for_collision(object, 'down', collisions[0].distance);
      }
      else if (i == UP && collisions[0].distance <= distance/2){
        any_collisions = true;
        object.inAir = false;
        CS.collision_detector.adjust_for_collision(object, 'up');
      }
      else if (i == LEFT && collisions[0].distance <= distance/2){
        any_collisions = true;
        object.inAir = false;
        CS.collision_detector.adjust_for_collision(object, 'left');
      }
      else if (i == RIGHT && collisions[0].distance <= distance/2){
        col_right = true;
        any_collisions = true;
        object.inAir = false;
        CS.collision_detector.adjust_for_collision(object, 'right');
      }
    }
  }
  if (!any_collisions){
    object.inAir = true;
  }
  else {

  }
};

CS.collision_detector.adjust_for_collision = function (object, col_dir, dist) {
	 if (col_dir === 'down') {
      object.falling = false;
      object.direction.y = 0;
      object.mesh.rotation.z = 0;
      object.mesh.position.y += (CS.UNIT - dist - 4);
    }
    if (col_dir === 'up') {
      if (!object.falling){
        object.direction.y *= -1;
      } else {
        object.falling = false;
        object.direction.y = 0;
        object.mesh.position.y += CS.UNIT;
      }
    }
    if (col_dir === 'right' || col_dir === 'left') {
      object.direction.x *= -1;
      if (col_dir === 'right') {
        object.mesh.position.x -= CS.UNIT/5;
        console.log('R_adjust');
      }
      if (col_dir === 'left') {
        object.mesh.position.x += CS.UNIT/5;
        console.log('L_adjust');
      }
    }
};