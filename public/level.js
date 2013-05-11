window.CS = window.CS || {};
CS.level1 = CS.level1 || {};

CS.level1.platforms = [];
CS.level1.nonCollidables = [];
CS.level1.makeTree = function(base_x, base_y){
  var height = Math.floor((Math.random() * 2) + 2);
  var a = [
    {x: (base_x - 1), y: (base_y + height), shader: CS.Shaders.FOLIAGE},
    {x: (base_x), y: (base_y + height), z: 1, shader: CS.Shaders.FOLIAGE},
    {x: (base_x + 1), y: (base_y + height), shader: CS.Shaders.FOLIAGE}
  ];
  for (var i = 0; i < height; i += 1){
    a.push({x: (base_x), y: (base_y + i), shader: CS.Shaders.BARK});
  }
  if (Math.random() < 0.5){
    a.push({x: base_x + 1, y: base_y + height - 1, shader: CS.Shaders.FOLIAGE});
  }
  if (Math.random() < 0.5){
    a.push({x: base_x + 1, y: base_y + height - 1, z: 1, shader: CS.Shaders.FOLIAGE});
  }
  if (Math.random() < 0.5){
    a.push({x: base_x - 1, y: base_y + height - 1, shader: CS.Shaders.FOLIAGE});
  }
  if (Math.random() < 0.5){
    a.push({x: base_x, y: base_y + height + 1, shader: CS.Shaders.FOLIAGE});
  }
  return a;
};

CS.level1.makeKeep = function(x, y){
  var keep = [
    "                                            ]]]]]]]              ",
    "                                           ]       ]             ",
    "                                          ]         ]            ",
    "]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]         ]]]]]]]]]]]]]",
    "]t                                                             T]",
    "]                                                               ]",
    "]                                                               ]",
    "]                                                               ]",
    "]  ]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]                       ]",
    "]  ]     ]                         ]                            ]",
    "]  ]     ]                         ]       ]       ]            ]",
    "]        ]t                        ]                            ]",
    "]        ]                         ]                         ]]]]",
    "]]]]]]]]]]                         ]                           T]",
    "]                                  ]]                           ]",
    "]                                  ]             ]]             ]",
    "]t      ]]]]]]                                                  ]",
    "]       ]                                                       ]",
    "]       ]       ]            ]]]           ]]]                  ]",
    "]       ]       ]                                               ]",
    "    ]]]]]       ]  ]                                            ]",
    "    ]           ]  ]]]   ]]]]]       ]                          ]",
    "    ]           ]        ]                                      ]",
    "                ]        ]                                      ]",
    "                ]        ]                                      ]",
    "]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]"
  ].reverse();
  for (var i = 0; i < keep.length; i += 1){
    for (var j = 0; j < keep[0].length; j += 1){
      if (keep[i][j] === ']') CS.level1.platforms.push({x: x + j, y: y + i, shader: CS.Shaders.STONE});
      if (keep[i][j] === 't') CS.level1.torches.push({x: x + j, y: y + i, wall: 'left'});
      if (keep[i][j] === 'T') CS.level1.torches.push({x: x + j, y: y + i, wall: 'left'});
      CS.level1.nonCollidables.push({x: x + j, y: y + i, z: -1, shader: CS.Shaders.STONE});

    }
  }
};

CS.level1.create = function(){
  // 100 units of trees in both directions
  var max_mountain_dist = 100;
  var mountain_start = Math.floor(Math.random() * max_mountain_dist);
  var last_tree = 0;
  for (var i = -100 ; i <= mountain_start; i += 1){
    CS.level1.platforms.push({x: i, y: -15, shader: CS.Shaders.GRASS});
    if (i == -100){
      for (var j = 0; j < 30; j += 1){
        CS.level1.platforms.push({x: i, y: -15 + j, shader: CS.Shaders.STONE});
      }
      continue;
    } else if (i == -99) {
      CS.level1.torches.push({x: i, y: 0, wall: 'left'});
    }
    var rand = Math.random();
    if (last_tree > 3 && rand < 0.2){
      last_tree = 0;
      var tree = CS.level1.makeTree(i, -14);
      for (var j = 0; j < tree.length; j += 1){
        CS.level1.platforms.push(tree[j]);
      }
    }
    last_tree += 1;
  }
  // Mountain
  var max_mountain_height = 40;
  var min_mountain_height = 15;
  var mountain_height = Math.floor(Math.random() * (max_mountain_height - min_mountain_height)) + min_mountain_height;
  for (var i = mountain_start ; i < mountain_start + mountain_height; i += 1){
    for (var j = 0; j < i - mountain_start; j += 1){
      if (i !== mountain_start + 1 && j === i - mountain_start - 1 && Math.random() < 0.5){
        // Dont draw a block
      } else {
        CS.level1.platforms.push({x: i, y: j  - 15, shader: CS.Shaders.GRASS});
      }
    }
  }
  CS.level1.makeKeep(mountain_start + mountain_height, mountain_height - 17);
};

CS.level1.meshes = [];

CS.level1.torches = [];
