window.CS = window.CS || {};
CS.Shaders = {};
CS.Shaders.fader = new THREE.ShaderMaterial({
    uniforms: {
    "tDiffuse":   { type: "t", value: null },
    "time":       { type: "f", value: Date.now() }
    },
    vertexShader: [
      "varying vec2 vUv;",
      "void main() {",
        "vUv = uv;",
        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
      "}"
    ].join("\n"),
    fragmentShader: [
    "uniform float time;",
    "uniform vec2 resolution;",
      "varying vec2 vUv;",
      "void main( void ) {",
        "vec2 position = -1.0 + 2.0 * vUv;",
        "float red = abs( sin( position.x * position.y + time / 5.0 ) );",
        "float green = abs( sin( position.x * position.y + time / 4.0 ) );",
        "float blue = abs( sin( position.x * position.y + time / 3.0 ) );",
        "gl_FragColor = vec4( red, green, blue, 1.0 );",
      "}"
    ].join("\n")
  });
CS.Shaders.standard = new THREE.ShaderMaterial({
  uniforms: {
  "tDiffuse":   { type: "t", value: null },
  "time":       { type: "f", value: Date.now() }
  },
  vertexShader:[
      "varying vec3 vNormal;",
      "void main() {",
        "vNormal = normal;",
        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
      "}"
  ].join("\n"),
  fragmentShader:[
      "varying vec3 vNormal;",
      "void main() {",
        "vec3 light = vec3(0.5,0.2,1.0);",
        "light = normalize(light);",
        "float dProd = max(0.0, dot(vNormal, 0.4*light));",
        "float dProd2 = max(0.0, dot(vNormal, 1.5*light));",
        "gl_FragColor = vec4(dProd, // R",
         "                   dProd2, // G",
         "                   dProd, // B",
         "                   1.0);  // A",
      "}"
    ].join("\n")
});
CS.Shaders.textures = {
  squares: THREE.ImageUtils.loadTexture( "textures/bright_squares256.png" ),
  tree: THREE.ImageUtils.loadTexture( "textures/blocks/leaves_opaque.png" ),
  grass: THREE.ImageUtils.loadTexture( "textures/blocks/grass_top.png" ),
  bark: THREE.ImageUtils.loadTexture( "textures/blocks/tree_jungle.png" ),
  torch: THREE.ImageUtils.loadTexture( "textures/blocks/torch.png" ),
  stone: THREE.ImageUtils.loadTexture( "textures/blocks/stonebrick.png" ),
  stars: THREE.ImageUtils.loadTexture( "textures/particle.png" ),
  trail: THREE.ImageUtils.loadTexture("textures/particle.png")
};
CS.Shaders.BARK = new THREE.MeshPhongMaterial( { shininess: 0, ambient: 0x333333, color: 0x964B00, specular: 0x222222, map: CS.Shaders.textures.bark });
CS.Shaders.FOLIAGE = new THREE.MeshPhongMaterial( { shininess: 80, ambient: 0x444444, color: 0x11dd11, specular: 0x222222, map: CS.Shaders.textures.tree });
CS.Shaders.STONE = new THREE.MeshPhongMaterial( { shininess: 0, ambient: 0x333333, color: 0x964B00, specular: 0x222222, map: CS.Shaders.textures.stone });
CS.Shaders.GRASS = new THREE.MeshPhongMaterial( { shininess: 80, ambient: 0x444444, color: 0x33dd33, specular: 0x222222, map: CS.Shaders.textures.grass });
CS.Shaders.TORCH = new THREE.MeshPhongMaterial( { map: CS.Shaders.textures.torch, transparent: true, color: 0xFFFFFF});
CS.Shaders.STARS = new THREE.ParticleBasicMaterial({ color: 0xFFFFFF, size: 20, map: CS.Shaders.textures.trail, blending: THREE.AdditiveBlending, transparent: true });
CS.Shaders.TRAIL =  new THREE.ParticleBasicMaterial({ color: 0xFFFFFF, size: 2, map: CS.Shaders.textures.trail , blending: THREE.AdditiveBlending, transparent: true });
