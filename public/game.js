window.CS = window.CS || { };
CS.UNIT = 10;

CS.init = function(){
  // set the scene size
  var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;

  // set some camera attributes
  var VIEW_ANGLE = 45,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1,
    FAR = 10000;

  CS.stats = new Stats();
  CS.stats.setMode(0);
  CS.stats.domElement.style.position = 'absolute';
  CS.stats.domElement.style.left = '0px';
  CS.stats.domElement.style.top = '0px';
  document.body.appendChild(CS.stats.domElement);

  // get the DOM element to attach to
  // - assume we've got jQuery to hand
  var $container = $('#container');

  // create a WebGL renderer, camera
  // and a scene
  CS.renderer = new THREE.WebGLRenderer();
  CS.camera =
    new THREE.PerspectiveCamera(
      VIEW_ANGLE,
      ASPECT,
      NEAR,
      FAR);

  CS.scene = new THREE.Scene();

  // add the camera to the scene
  CS.scene.add(CS.camera);

  // the camera starts at 0,0,0
  // so pull it back
  CS.camera.position.x = 50;
  CS.camera.position.y = 10;
  CS.camera.position.z = 320;

  // start the renderer
  CS.renderer.setSize(WIDTH, HEIGHT);

  // attach the render-supplied DOM element
  $container.append(CS.renderer.domElement);
  var vShader = $('#vertexshader');
  var fShader = $('#fragmentshader');

  CS.shaderMaterial = CS.Shaders.fader;

  CS.level1.create();
  CS.drawArray(CS.level1.platforms, false);
  CS.drawArray(CS.level1.nonCollidables, true);

  CS.player.mesh = new THREE.Mesh(new CS.player.geometry(CS.UNIT, CS.UNIT, CS.UNIT, 1, 1, 1), CS.shaderMaterial);
  CS.player.mesh.position.x = CS.player.position.x * CS.UNIT;
  CS.player.mesh.position.y = CS.player.position.y * CS.UNIT;
  CS.player.mesh.position.z = CS.player.position.z * CS.UNIT;
  CS.scene.add(CS.player.mesh);

  CS.setupLights();
  CS.stars.drawParticles();
  CS.player.init_trail();

  CS.renderer.render(CS.scene, CS.camera);
  CS.start();
};

CS.setupLights = function(){
  CS.pointLight = new THREE.PointLight(0xFFFFFF);
  CS.pointLight.castShadow = true;

  CS.pointLight.position.x = 10;
  CS.pointLight.position.y = 50;
  CS.pointLight.position.z = 130;

  CS.scene.add(CS.pointLight);
  for (var i = 0; i < CS.level1.torches.length; i += 1){
    var l = new THREE.PointLight(0xFF9999);
    var torch  = CS.level1.torches[i];
    l.position.x = torch.x * CS.UNIT;
    l.position.y = torch.y * CS.UNIT;
    l.position.z = 1;
    l.intensity = 2;
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(CS.UNIT, CS.UNIT), CS.Shaders.TORCH);
    plane.position.x = torch.x * CS.UNIT;
    plane.position.y = torch.y * CS.UNIT;
    plane.rotation.z = torch.wall == 'left' ? 5 : -5;
    CS.scene.add(l);
    CS.scene.add(plane);
  }
};

CS.start = function(){
  CS.animate();
};

CS.gravity = 0.05;

var start = Date.now();
CS.animate = function() {
  var time = Date.now();

  CS.frameTime = time - CS._lastFrameTime;
  CS._lastFrameTime = time;
  CS.cumulatedFrameTime += CS.frameTime;
  CS.shaderMaterial.uniforms['time'].value = .0025 * ( Date.now() - start )

  while (CS.cumulatedFrameTime > CS.gameStepTime) {
    // movement will go here
    CS.cumulatedFrameTime -= CS.gameStepTime;
    CS.player.move();
    CS.camera.position.y = CS.player.mesh.position.y;
    CS.camera.position.x = CS.player.mesh.position.x;
    CS.player.collision();
    CS.player.update_trail();
    CS.stars.animation();
  }
  CS.stats.update();
  CS.renderer.render(CS.scene, CS.camera);
  if(!CS.gameOver) window.requestAnimationFrame(CS.animate);
}

CS.drawArray = function(ar, merge){
  var geo = new THREE.Geometry();
  var prev_shader = 0;
  for (var i = 0; i < ar.length; i++){
    var platform = ar[i];
    var shader = platform.shader || CS.Shaders.standard;
    var cube = new THREE.Mesh(new THREE.CubeGeometry(CS.UNIT, CS.UNIT, CS.UNIT, 1, 1, 1), shader);
    cube.position.x = platform.x*CS.UNIT;
    cube.position.y = platform.y*CS.UNIT;
    cube.position.z = (platform.z || 0)*CS.UNIT;
    if (merge == true) {
      if ( (shader == prev_shader || prev_shader == 0) && i != ar.length -1) {
        THREE.GeometryUtils.merge(geo, cube);
      }
      else {
        var mergedMesh = new THREE.Mesh(geo, prev_shader);
        CS.scene.add(mergedMesh);
        geo = new THREE.Geometry();
        THREE.GeometryUtils.merge(geo, cube);
        console.log('added merge');
      }
    }
    else {
      CS.scene.add(cube);
    }
    prev_shader = shader;
    CS.level1.meshes.push(cube);
  }
};

CS.gameStepTime = 50;

CS.frameTime = 0; // ms
CS.cumulatedFrameTime = 0; // ms
CS._lastFrameTime = Date.now(); // timestamp

CS.gameOver = false;

window.addEventListener("load", CS.init);
