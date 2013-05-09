window.CS = window.CS || { };

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
  CS.camera.position.z = 350;

  // start the renderer
  CS.renderer.setSize(WIDTH, HEIGHT);

  // attach the render-supplied DOM element
  $container.append(CS.renderer.domElement);
  var vShader = $('#vertexshader');
  var fShader = $('#fragmentshader');

  var shaderMaterial =
    new THREE.ShaderMaterial({
      vertexShader:   vShader.text(),
      fragmentShader: fShader.text()
    });

  for (var i = 0; i < CS.level1.platforms.length; i++){
    var platform = CS.level1.platforms[i];
    var cube = new THREE.Mesh(new THREE.CubeGeometry(CS.UNIT, CS.UNIT, CS.UNIT, 5, 5, 5), shaderMaterial);
    cube.position.x = platform.x*CS.UNIT;
    cube.position.y = platform.y*CS.UNIT;
    CS.level1.meshes.push(cube);
    CS.scene.add(cube);
  }

  // create the sphere's material
  var mainMaterial = new THREE.MeshFaceMaterial({color: 0xCC0000});
  CS.player.mesh = new THREE.Mesh( new CS.player.geometry(10,50,50), shaderMaterial);
  CS.player.mesh.position.x = CS.player.position.x * CS.UNIT;
  CS.player.mesh.position.y = CS.player.position.y * CS.UNIT;
  CS.player.mesh.position.z = CS.player.position.z * CS.UNIT;
  CS.scene.add(CS.player.mesh);
  // create a point light
  var pointLight =
    new THREE.PointLight(0xFFFFFF);

  // set its position
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;

  // add to the scene
  CS.scene.add(pointLight);
  // draw!
  CS.renderer.render(CS.scene, CS.camera);
  CS.start();
};

CS.start = function(){
  CS.animate();
};

CS.animate = function() {
  var time = Date.now();

  CS.frameTime = time - CS._lastFrameTime;
  CS._lastFrameTime = time;
  CS.cumulatedFrameTime += CS.frameTime;

  while (CS.cumulatedFrameTime > CS.gameStepTime) {
    // movement will go here
    CS.cumulatedFrameTime -= CS.gameStepTime;
    CS.player.move();
    CS.player.collision();
  }
  CS.stats.update();
  CS.renderer.render(CS.scene, CS.camera);
  if(!CS.gameOver) window.requestAnimationFrame(CS.animate);
}
CS.gameStepTime = 50;

CS.frameTime = 0; // ms
CS.cumulatedFrameTime = 0; // ms
CS._lastFrameTime = Date.now(); // timestamp

CS.gameOver = false;

CS.UNIT = 10;

window.addEventListener("load", CS.init);
