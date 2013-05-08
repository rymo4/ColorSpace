window.CS = window.CS || {};
CS.player = CS.player || {};

CS.player.material = THREE.MeshFaceMaterial;//({color: 0xCC0000});
CS.player.geometry = THREE.SphereGeometry;
CS.player.position = {x: 0, y: 5, z: 0};
CS.player.move = function(x, y, z){
  CS.player.position.x += x;
  CS.player.position.y += y;
  CS.player.position.z += z;
  CS.player.mesh.position.x += x;
  CS.player.mesh.position.y += y;
  CS.player.mesh.position.z += z;
};
