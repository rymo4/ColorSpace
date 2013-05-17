window.CS = window.CS || {};
CS.Shaders = {};

CS.Shaders.RGB_SHIFTER = {
  uniforms: {
    "tDiffuse": { type: "t", value: null },
    "amount":   { type: "f", value: 0.005 },
    "angle":    { type: "f", value: 0.0 }
  },
  vertexShader: [
    "varying vec2 vUv;",
    "void main() {",
      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
    "}"
  ].join("\n"),
  fragmentShader: [
    "uniform sampler2D tDiffuse;",
    "uniform float amount;",
    "uniform float angle;",
    "varying vec2 vUv;",
    "void main() {",
      "vec2 offset = amount * vec2( cos(angle), sin(angle));",
      "vec4 cr = texture2D(tDiffuse, vUv + offset);",
      "vec4 cga = texture2D(tDiffuse, vUv);",
      "vec4 cb = texture2D(tDiffuse, vUv - offset);",
      "gl_FragColor = vec4(cr.r, cga.g, cb.b, cga.a);",
    "}"
  ].join("\n")
};
CS.Shaders.VIGNETTE = {
  uniforms: {
    "tDiffuse": { type: "t", value: null },
    "offset":   { type: "f", value: 1.0 },
    "darkness": { type: "f", value: 1.0 }
  },
  vertexShader: [
    "varying vec2 vUv;",
    "void main() {",
      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
    "}"
  ].join("\n"),
  fragmentShader: [
    "uniform float offset;",
    "uniform float darkness;",
    "uniform sampler2D tDiffuse;",
    "varying vec2 vUv;",
    "void main() {",
      "vec4 texel = texture2D( tDiffuse, vUv );",
      "vec2 uv = ( vUv - vec2( 0.5 ) ) * vec2( offset );",
      "gl_FragColor = vec4( mix( texel.rgb, vec3( 1.0 - darkness ), dot( uv, uv ) ), texel.a );",
      /*
      // alternative version from glfx.js
      // this one makes more "dusty" look (as opposed to "burned")

      "vec4 color = texture2D( tDiffuse, vUv );",
      "float dist = distance( vUv, vec2( 0.5 ) );",
      "color.rgb *= smoothstep( 0.8, offset * 0.799, dist *( darkness + offset ) );",
      "gl_FragColor = color;",
      */
    "}"
  ].join("\n")
};
CS.Shaders.DOT_SCREEN_SHADER = {
  uniforms: {
    "tDiffuse": { type: "t", value: null },
    "tSize":    { type: "v2", value: new THREE.Vector2( 256, 256 ) },
    "center":   { type: "v2", value: new THREE.Vector2( 0.5, 0.5 ) },
    "angle":    { type: "f", value: 1.57 },
    "scale":    { type: "f", value: 1.0 }
  },
  vertexShader: [
    "varying vec2 vUv;",
    "void main() {",
      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
    "}"
  ].join("\n"),
  fragmentShader: [
    "uniform vec2 center;",
    "uniform float angle;",
    "uniform float scale;",
    "uniform vec2 tSize;",
    "uniform sampler2D tDiffuse;",
    "varying vec2 vUv;",
    "float pattern() {",
      "float s = sin( angle ), c = cos( angle );",
      "vec2 tex = vUv * tSize - center;",
      "vec2 point = vec2( c * tex.x - s * tex.y, s * tex.x + c * tex.y ) * scale;",
      "return ( sin( point.x ) * sin( point.y ) ) * 4.0;",
    "}",
    "void main() {",
      "vec4 color = texture2D( tDiffuse, vUv );",
      "float average = ( color.r + color.g + color.b ) / 3.0;",
      "gl_FragColor = vec4( vec3( average * 10.0 - 5.0 + pattern() ), color.a );",
    "}"
  ].join("\n")
};

CS.Shaders.FILM = {
  uniforms: {
    "tDiffuse":   { type: "t", value: null },
    "time":       { type: "f", value: 0.0 },
    "nIntensity": { type: "f", value: 0.5 },
    "sIntensity": { type: "f", value: 0.05 },
    "sCount":     { type: "f", value: 4096 },
    "grayscale":  { type: "i", value: 0 }
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
    "uniform bool grayscale;",
    "uniform float nIntensity;",
    "uniform float sIntensity;",
    "uniform float sCount;",
    "uniform sampler2D tDiffuse;",
    "varying vec2 vUv;",
    "void main() {",
      "vec4 cTextureScreen = texture2D( tDiffuse, vUv );",
      "float x = vUv.x * vUv.y * time *  1000.0;",
      "x = mod( x, 13.0 ) * mod( x, 123.0 );",
      "float dx = mod( x, 0.01 );",
      "vec3 cResult = cTextureScreen.rgb + cTextureScreen.rgb * clamp( 0.1 + dx * 100.0, 0.0, 1.0 );",
      "vec2 sc = vec2( sin( vUv.y * sCount ), cos( vUv.y * sCount ) );",
      "cResult += cTextureScreen.rgb * vec3( sc.x, sc.y, sc.x ) * sIntensity;",
      "cResult = cTextureScreen.rgb + clamp( nIntensity, 0.0,1.0 ) * ( cResult - cTextureScreen.rgb );",
      "if( grayscale ) {",
        "cResult = vec3( cResult.r * 0.3 + cResult.g * 0.59 + cResult.b * 0.11 );",
      "}",
      "gl_FragColor =  vec4( cResult, cTextureScreen.a );",
    "}"
  ].join("\n")
};

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
  grass_side: THREE.ImageUtils.loadTexture( "textures/blocks/grass_side.png" ),
  bark: THREE.ImageUtils.loadTexture( "textures/blocks/tree_jungle.png" ),
  torch: THREE.ImageUtils.loadTexture( "textures/blocks/torch.png" ),
  stone: THREE.ImageUtils.loadTexture( "textures/blocks/stonebrick.png" ),
  shroom_red: THREE.ImageUtils.loadTexture( "textures/blocks/mushroom_red.png" ),
  shroom_brown: THREE.ImageUtils.loadTexture( "textures/blocks/mushroom_brown.png" ),
  stars: THREE.ImageUtils.loadTexture( "textures/particle.png" ),
  weeds: THREE.ImageUtils.loadTexture( "textures/blocks/crops_1.png" ),
  trail: THREE.ImageUtils.loadTexture("textures/particle.png")
};




CS.Shaders.BARK = new THREE.MeshPhongMaterial( { shininess: 0, ambient: 0x333333, color: 0x964B00, specular: 0x222222, map: CS.Shaders.textures.bark });
CS.Shaders.FOLIAGE = new THREE.MeshPhongMaterial( { shininess: 80, ambient: 0x444444, color: 0x11dd11, specular: 0x222222, map: CS.Shaders.textures.tree });
CS.Shaders.STONE = new THREE.MeshPhongMaterial( { shininess: 0, ambient: 0x333333, color: 0x964B00, specular: 0x222222, map: CS.Shaders.textures.stone });
CS.Shaders.GRASS = new THREE.MeshPhongMaterial( { shininess: 80, ambient: 0x444444, color: 0x33dd33, specular: 0x222222, map: CS.Shaders.textures.grass });
CS.Shaders.GRASS_SIDE = new THREE.MeshPhongMaterial( { shininess: 80, ambient: 0x444444, specular: 0x222222, map: CS.Shaders.textures.grass_side });
CS.Shaders.TORCH = new THREE.MeshPhongMaterial( { map: CS.Shaders.textures.torch, transparent: true, color: 0xFFFFFF});
CS.Shaders.SHROOM_RED = new THREE.MeshPhongMaterial( { map: CS.Shaders.textures.shroom_red, transparent: true});
CS.Shaders.SHROOM_BROWN = new THREE.MeshPhongMaterial( { map: CS.Shaders.textures.shroom_brown, transparent: true});
CS.Shaders.WEEDS = new THREE.MeshPhongMaterial( { map: CS.Shaders.textures.weeds, transparent: true, color: 0x00FF00});
CS.Shaders.STARS = new  THREE.ParticleBasicMaterial({ color: 0xFFFFFF, size: 20, map: CS.Shaders.textures.trail, blending: THREE.AdditiveBlending, transparent: true });
CS.Shaders.TRAIL =  new THREE.ParticleBasicMaterial({ color: 0xFFFFFF, size: 2, map: CS.Shaders.textures.trail , blending: THREE.AdditiveBlending, transparent: true });
