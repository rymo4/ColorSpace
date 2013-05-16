window.CS = window.CS || {};
CS.effects = CS.effects || {};

CS.effects.activeEffects = [];

CS.effects.all = {};
CS.effects.list = ['DOT_SCREEN'];

CS.effects.setup = function() {
  CS.effects.all.DOT_SCREEN = new THREE.ShaderPass(CS.Shaders.DOT_SCREEN);
  CS.effects.all.DOT_SCREEN.uniforms.scale.value = 4;
  CS.effects.all.DOT_SCREEN.__needed = ['scale'];

  //CS.effects.all.RGB_SHIFTER = new THREE.ShaderPass(CS.Shaders.RGB_SHIFTER);
 ///CS.effects.all.RGB_SHIFTER.uniforms.amount.value = 0.0015;
  //CS.effects.all.RGB_SHIFTER.renderToScreen = true;
  //CS.effects.all.RGB_SHIFTER.__needed = ['amount'];

  //CS.effects.all.FILM = new THREE.ShaderPass(CS.Shaders.FILM);
  //CS.effects.all.FILM.__needed = ['time', 'nIntensity', 'sIntensity'];
};

CS.effects.addRandomEffect = function() {
  var effect_name = CS.effects.list[Math.floor(Math.random() * CS.effects.list.length)];
  CS.composer.addPass(
    CS.effects.all[effect_name]
  );
  console.log(effect_name);
  CS.effects.activeEffects.push(effect_name);
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
      if (attr === time){
        effect.uniforms[attr].value = Date.now();
      } else {
        // TODO: Use range and better function
        //effect.uniforms[attr].value *= 1.00001;
      }
    }

  }

};
