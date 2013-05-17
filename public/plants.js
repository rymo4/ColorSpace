window.CS = window.CS || {};
CS.level = CS.level || {};
CS.plants = CS.plants || {};
CS.level.plants = CS.level.plants || {};
CS.level.plantTypes = [];
CS.plants.meshes = [];

CS.plants.add = function(x, y, type, probability){
  if (!CS.level.plants[type]){
    CS.level.plants[type] = [];
    CS.level.plantTypes.push(type);
  }
  if (Math.random() < probability){
    CS.level.plants[type].push({x: x, y: y, shader: CS.Shaders[type.toUpperCase()]});
  }
};

CS.plants.render = function(){
  for (var i = 0; i < CS.level.plantTypes.length; i++){
    var type = CS.level.plantTypes[i]
    var plants = CS.level.plants[type];
    CS.plants.draw(plants, type);
  }
};

CS.plants.draw = function(plants, type) {
  for (var i = 0; i < plants.length; i += 1){
    CS.plants.draw_plant(plants, type, i);
  }
};

CS.plants.spawn_random_plant = function(type) {
  for (var i = 0; i < CS.level.plantTypes.length; i++){
    if (CS.level.plantTypes[i] === type) {
      var plants = CS.level.plants[type];
      var index = Math.floor(Math.random() * plants.length);
      CS.plants.draw_plant(plants, type, index);
    }
  }
};

CS.plants.draw_plant = function(plants, type, index){
  var shroom = plants[index];
  var mesh = new THREE.Mesh(new THREE.PlaneGeometry(CS.UNIT, CS.UNIT), CS.Shaders[type.toUpperCase()]);
  mesh.position.x = shroom.x * (Math.random() - 0.5)* 30 * CS.UNIT;
  mesh.position.y = shroom.y * CS.UNIT;
  var z_centered_around = CS.UNIT / 2;
  var rand_side = Math.floor(Math.random() * (CS.UNIT + 1)) + z_centered_around;
  mesh.position.z = rand_side;
  CS.level.meshes.push(mesh);
  CS.scene.add(mesh);
};
