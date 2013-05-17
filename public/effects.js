window.CS = window.CS || {};
CS.effects = CS.effects || {};

CS.effects.activeEffects = [];

CS.effects.all = {};
CS.effects.list = ['RGB_SHIFTER', 'FILM', 'DOT_SCREEN_SHADER', 'SEPIA', 'BLEACH'];

CS.effects.setup = function() {
  CS.effects.all.DOT_SCREEN_SHADER = new THREE.ShaderPass(CS.Shaders.DOT_SCREEN_SHADER);
  CS.effects.all.DOT_SCREEN_SHADER.uniforms.scale.value = 400;
  CS.effects.all.DOT_SCREEN_SHADER.__needed = ['scale'];
  CS.effects.all.DOT_SCREEN_SHADER.__scale = 10;

  CS.effects.all.RGB_SHIFTER = new THREE.ShaderPass(CS.Shaders.RGB_SHIFTER);
  CS.effects.all.RGB_SHIFTER.uniforms.amount.value = 0.0015;
  CS.effects.all.RGB_SHIFTER.__needed = ['amount'];
  CS.effects.all.RGB_SHIFTER.__scale = 0.005;

  CS.effects.all.SEPIA = new THREE.ShaderPass(CS.Shaders.SEPIA);
  CS.effects.all.SEPIA.__needed = [];

  CS.effects.all.FILM = new THREE.ShaderPass(CS.Shaders.FILM);
  CS.effects.all.FILM.uniforms[ "sCount" ].value = 800;
  CS.effects.all.FILM.uniforms[ "sIntensity" ].value = 0.9;
  CS.effects.all.FILM.uniforms[ "nIntensity" ].value = 0.4;
  CS.effects.all.FILM.__needed = ['time']//, 'nIntensity', 'sIntensity'];

  CS.effects.all.BLEACH = new THREE.ShaderPass(CS.Shaders.BLEACH);
  CS.effects.all.BLEACH.__needed = [];

  CS.effects.all.VIGNETTE = new THREE.ShaderPass(CS.Shaders.VIGNETTE);
  CS.effects.all.VIGNETTE.uniforms.darkness.value = 3.0;
  CS.effects.all.VIGNETTE.renderToScreen = true;
  CS.composer.addPass(CS.effects.all.VIGNETTE);
};

CS.effects.addRandomEffect = function() {
  CS.composer = new THREE.EffectComposer(CS.renderer);
  CS.composer.addPass(new THREE.RenderPass(CS.scene, CS.camera));
  var effect_name = CS.effects.list[Math.floor(Math.random() * CS.effects.list.length)];
  CS.composer.addPass(
    CS.effects.all[effect_name]
  );
  console.log(effect_name);
  CS.effects.activeEffects.push(effect_name);
  // always last
  CS.composer.addPass(CS.effects.all.VIGNETTE);
};

// Sets the current time in the activeEffects that need it
// and handles wearing off of effects
CS.effects.update = function(){
  for (var i = 0; i < CS.effects.activeEffects.length; i++){
    var effect_name = CS.effects.activeEffects[i];
    var effect = CS.effects.all[effect_name];
    var to_update = effect.__needed;
    for (var j = 0; j < to_update.length; j++){
      var attr = to_update[j];
      if (attr === 'time'){
        effect.uniforms[attr].value = Date.now();
      } else {
        effect.uniforms[attr].value += effect.__scale * Math.sin(Date.now());
      }
    }

  }

};
