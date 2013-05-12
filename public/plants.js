window.CS = window.CS || {};
CS.plants = CS.plants || {};

CS.plants.draw = function(plants){
  for (var i = 0; i < plants.length ; i += 1){
    var shroom = plants[i];
    var mesh = new THREE.Mesh(new THREE.PlaneGeometry(CS.UNIT, CS.UNIT), CS.Shaders.SHROOM);
    mesh.position.x = shroom.x*CS.UNIT;
    mesh.position.y = shroom.y*CS.UNIT;
    var z_centered_around = CS.UNIT / 2;
    var rand_side = Math.floor(Math.random() * (CS.UNIT + 1)) + z_centered_around;
    mesh.position.z = rand_side;
    CS.level1.meshes.push(mesh);
    CS.scene.add(mesh);
  }
};
