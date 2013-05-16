window.CS = window.CS || {};
CS.collision_detector = CS.collision_detector || {};

//DIRECTION NUMBERS, THEY ARE CORRELATED TO THE ORDER OF THE VECTORS BELOW
 var RIGHT      = 0,
     UP         = 1,
     LEFT       = 2,
     DOWN       = 3,
     UP_RIGHT   = 4,
     UP_LEFT    = 5,
     DOWN_LEFT  = 6,
     DOWN_RIGHT = 7;


// Rays in each direction for ray casting collisions
var w = 10;
CS.collision_detector.rays = [
  new THREE.Vector3(w, 0, 0), // RIGHT
  new THREE.Vector3(0, w, 0), // UP
  new THREE.Vector3(-w, 0, 0), // LEFT
  new THREE.Vector3(0, -w, 0),//, // DOWN
  new THREE.Vector3(w, w, 0), // UP_RIGHT
  new THREE.Vector3(-w, w, 0), // UP_LEFT
  new THREE.Vector3(-w, -w, 0), // DOWN_LEFT
  new THREE.Vector3(w, -w, 0)// DOWN_RIGHT
];

CS.collision_detector.caster = new THREE.Raycaster();

CS.collision_detector.detect = function (object) {
  var collisions,
      distance = CS.UNIT,
      obstacles = CS.level.meshes;
  var any_collisions = false;
  var col_down = false,
  	  col_up = false;
  for (var i = 0; i < CS.collision_detector.rays.length; i += 1) {
    CS.collision_detector.caster.set(object.mesh.position, CS.collision_detector.rays[i]);
    collisions = CS.collision_detector.caster.intersectObjects(obstacles);
    if (collisions.length > 0){
      if (i == DOWN && collisions[0].distance <= distance){
        any_collisions = true;
        col_down = true;
        CS.collision_detector.adjust_for_collision(object, DOWN, collisions[0].distance);
      }
      else if (i == UP && collisions[0].distance <= distance/2){
        any_collisions = true;
        col_up = true;
        CS.collision_detector.adjust_for_collision(object, UP);
      }
      else if (i == LEFT && collisions[0].distance <= distance/2){
        any_collisions = true;
        CS.collision_detector.adjust_for_collision(object, LEFT);
      }
      else if (i == RIGHT && collisions[0].distance <= distance/2){
        any_collisions = true;
        CS.collision_detector.adjust_for_collision(object, RIGHT);
      }
      else if (!col_down && i == DOWN_RIGHT && collisions[0].distance <= distance){
        any_collisions = true;
        CS.collision_detector.adjust_for_collision(object, DOWN_RIGHT, collisions[0].distance);
      }
      else if (!col_up && i == UP_RIGHT && collisions[0].distance <= distance/2){
        any_collisions = true;
        CS.collision_detector.adjust_for_collision(object, UP_RIGHT);
      }
      else if (!col_down && i == DOWN_LEFT && collisions[0].distance <= distance/2){
        any_collisions = true;
        CS.collision_detector.adjust_for_collision(object, DOWN_LEFT);
      }
      else if (!col_up && i == UP_LEFT && collisions[0].distance <= distance/2){
        any_collisions = true;
        CS.collision_detector.adjust_for_collision(object, UP_LEFT);
      }
    }
  }
  if (any_collisions){
    return true;
  }
  else {
  	return false;
  }
};

CS.collision_detector.adjust_for_collision = function (object, col_dir, dist) {
	if (col_dir === DOWN) {
      object.falling = false;
      object.direction.y = 0;
      object.mesh.rotation.z = 0;
      object.mesh.position.y += (CS.UNIT - dist - 4);
    }
    else if (col_dir === UP) {
      if (!object.falling){
        object.direction.y *= -1;
      } else {
        object.falling = false;
        object.direction.y = 0;
        object.mesh.position.y += CS.UNIT;
      }
    }
    else if (col_dir === RIGHT || col_dir === LEFT) {
      object.direction.x *= -1;
      if (col_dir === RIGHT) {
        object.mesh.position.x -= CS.UNIT/5;
      }
      if (col_dir === LEFT) {
        object.mesh.position.x += CS.UNIT/5;
      }
    }
    else if (col_dir === DOWN_RIGHT) {
      console.log('col_down_right');
      //ADJUST FOR DOWN
      object.falling = false;
      object.direction.y = 0;
      object.mesh.rotation.z = 0;
      object.mesh.position.y += (CS.UNIT - dist - 4);
      //ADJUST FOR RIGHT
      object.direction.x *= -1;
      object.mesh.position.x -= CS.UNIT/5;
    }
    else if (col_dir === DOWN_LEFT) {
      console.log('col_down_left');
      //ADJUST FOR DOWN
      object.falling = false;
      console.log('1');
      object.direction.y = 0;
      console.log('2');
      object.mesh.rotation.z = 0;
      console.log('3');
      object.mesh.position.y += (CS.UNIT - dist - 4);
      console.log('4');
      //ADJUST FOR LEFT
      object.direction.x *= -1;
      console.log('5');
      object.mesh.position.x += CS.UNIT/5;
      console.log('6');
    }
    else if (col_dir === UP_RIGHT) {
      console.log('col_up_right');
      //ADJUST FOR UP
      if (!object.falling){
        object.direction.y *= -1;
      } else {
        object.falling = false;
        object.direction.y = 0;
        object.mesh.position.y += CS.UNIT;
      }
      //ADJUST FOR RIGHT
      object.direction.x *= -1;
      object.mesh.position.x -= CS.UNIT/5;
    }
    else if (col_dir === UP_LEFT) {
      console.log('col_up_left')
      //ADJUST FOR UP
      if (!object.falling){
        object.direction.y *= -1;
      } else {
        object.falling = false;
        object.direction.y = 0;
        object.mesh.position.y += CS.UNIT;
      }
      //ADJUST FOR LEFT
      object.direction.x *= -1;
      object.mesh.position.x += CS.UNIT/5;
    }
};