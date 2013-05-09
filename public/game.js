$(document).ready(function(){
  // set the scene size
  var WIDTH = 800,
    HEIGHT = 500;

  // set some camera attributes
  var VIEW_ANGLE = 45,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1,
    FAR = 10000;

  // get the DOM element to attach to
  // - assume we've got jQuery to hand
  var $container = $('#container');

  // create a WebGL renderer, camera
  // and a scene
  var renderer = new THREE.WebGLRenderer();
  var camera =
    new THREE.PerspectiveCamera(
      VIEW_ANGLE,
      ASPECT,
      NEAR,
      FAR);

  var scene = new THREE.Scene();

  // add the camera to the scene
  scene.add(camera);

  // the camera starts at 0,0,0
  // so pull it back
  camera.position.x = 50;
  camera.position.y = 10;
  camera.position.z = 350;

  // start the renderer
  renderer.setSize(WIDTH, HEIGHT);

  // attach the render-supplied DOM element
  $container.append(renderer.domElement);
  var vShader = $('#vertexshader');
  var fShader = $('#fragmentshader');

  var shaderMaterial =
    new THREE.ShaderMaterial({
      vertexShader:   vShader.text(),
      fragmentShader: fShader.text()
    });
  for (var i = 0; i < 40; i++){
    var cube_width = 10;
    var cube = new THREE.Mesh(new THREE.CubeGeometry(cube_width, cube_width, 5, 5, 5, 5), shaderMaterial);
    cube.position.x = -150 + cube_width*i;
    cube.position.y = -100;
    scene.add(cube);
  }

  // create the sphere's material
  var mainMaterial = new THREE.MeshFaceMaterial({color: 0xCC0000});
  var sphere = new THREE.Mesh( new THREE.SphereGeometry(10,50,50), shaderMaterial);
  scene.add(sphere);


  // create a point light
  var pointLight =
    new THREE.PointLight(0xFFFFFF);

  // set its position
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;

  // add to the scene
  scene.add(pointLight);
  // draw!
  renderer.render(scene, camera);
});
