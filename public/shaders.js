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
  squares: THREE.ImageUtils.loadTexture( "textures/bright_squares256.png" )
};
CS.Shaders.BARK = new THREE.MeshPhongMaterial( { shininess: 0, ambient: 0x444444, color: 0x964B00, specular: 0x333333, map: CS.Shaders.textures.squares });
CS.Shaders.FOLIAGE = new THREE.MeshPhongMaterial( { shininess: 80, ambient: 0x444444, color: 0x11dd11, specular: 0x333333, map: CS.Shaders.textures.squares });
