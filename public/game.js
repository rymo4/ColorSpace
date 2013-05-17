window.CS = window.CS || { };
CS.UNIT = 10;
CS.gameStepTime = 50;
CS.frameTime = 0;
CS.cumulatedFrameTime = 0;
CS._lastFrameTime = Date.now();
CS.gameOver = false;

CS.init = function(){
  var WIDTH = window.innerWidth,
      HEIGHT = window.innerHeight;

  var VIEW_ANGLE = 45,
      ASPECT = WIDTH / HEIGHT,
      NEAR = 0.1,
      FAR = 10000;

  CS.stats = new Stats();
  CS.stats.setMode(0);
  /*
  CS.stats.domElement.style.position = 'absolute';
  CS.stats.domElement.style.left = '0px';
  CS.stats.domElement.style.top = '0px';
  document.body.appendChild(CS.stats.domElement);
  */

  var $container = $('#container');
  $container.show();

  CS.renderer = new THREE.WebGLRenderer();
  CS.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

  CS.scene = new THREE.Scene();
  CS.scene.add(CS.camera);

  CS.camera.position.x = 50;
  CS.camera.position.y = 10;
  CS.camera.position.z = 320;

  CS.renderer.setSize(WIDTH, HEIGHT);

  ////////// POST PROCESSING EFFECTS
  CS.composer = new THREE.EffectComposer(CS.renderer);
  CS.composer.addPass(new THREE.RenderPass(CS.scene, CS.camera));
  CS.effects.setup();
  CS.copyPass = new THREE.ShaderPass(THREE.CopyShader);
  CS.composer.addPass(CS.copyPass);

  $container.append(CS.renderer.domElement);

  CS.level.create();
  CS.drawArray(CS.level.platforms, true);
  CS.drawArray(CS.level.nonCollidables, false);
  CS.drawPlaneArray(CS.level.torches);
  CS.plants.render();

  CS.player.mesh = new THREE.Mesh(new CS.player.geometry(CS.UNIT, CS.UNIT, CS.UNIT, 20, 20, 20), CS.Shaders.fader);
  CS.player.mesh.position.x = CS.player.position.x * CS.UNIT;
  if (!CS.player.inAir){
    CS.player.mesh.position.y = CS.player.position.y * CS.UNIT;
  }
  CS.player.mesh.position.z = CS.player.position.z * CS.UNIT;
  CS.scene.add(CS.player.mesh);

  CS.setupLights();
  CS.stars.drawParticles();
  CS.player.initTrail();

  var loop_handle= setInterval(CS.level.spawn_shroom, 5000);

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
};

CS.drawPlaneArray = function(ar){
  for (var i = 0; i < ar.length; i += 1){
    var l = new THREE.PointLight(0xFF7F00);
    var torch  = ar[i];
    l.position.x = torch.x * CS.UNIT;
    l.position.y = torch.y * CS.UNIT;
    l.position.z = 11;
    l.intensity = 1;
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
  CS.Shaders.fader.uniforms['time'].value = .0025 * ( Date.now() - start )

  while (CS.cumulatedFrameTime > CS.gameStepTime) {
    // movement will go here
    CS.cumulatedFrameTime -= CS.gameStepTime;
    CS.player.move();
    CS.camera.position.y = CS.player.mesh.position.y;
    CS.camera.position.x = CS.player.mesh.position.x;
    CS.player.collision();
    CS.player.updateTrail();
    CS.stars.animation();
    CS.effects.update();
  }
  CS.stats.update();
  CS.composer.render();
  if(!CS.gameOver) window.requestAnimationFrame(CS.animate);
}

CS.drawArray = function(ar, has_collision){
  var geo = new THREE.Geometry();
  var prev_shader = 0;
  for (var i = 0; i < ar.length; i++){
    var platform = ar[i];
    var shader = platform.shader || CS.Shaders.standard;
    var cube = new THREE.Mesh(new THREE.CubeGeometry(CS.UNIT, CS.UNIT, CS.UNIT, 1, 1, 1), shader);
    cube.position.x = platform.x*CS.UNIT;
    cube.position.y = platform.y*CS.UNIT;
    cube.position.z = (platform.z || 0)*CS.UNIT;
    if (has_collision != true) {
      CS.level.meshes.push(cube);
      if ( (shader == prev_shader || prev_shader == 0) && i != ar.length -1) {
        THREE.GeometryUtils.merge(geo, cube);
      }
      else {
        var mergedMesh = new THREE.Mesh(geo, prev_shader);
        CS.scene.add(mergedMesh);
        geo = new THREE.Geometry();
        THREE.GeometryUtils.merge(geo, cube);
      }
    }
    else {
      CS.scene.add(cube);
      CS.level.meshes.push(cube);
    }
    prev_shader = shader;
  }
};

$(document).ready(function(){
  $('#container').hide();
  $('#play').click(function(){
    $('body').css('background', '#000');
    $('#intro').hide();
    CS.init();
  });
});
