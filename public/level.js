window.CS = window.CS || {};
CS.level1 = CS.level1 || {};

CS.level1.platforms = [];
CS.level1.makeTree = function(base_x, base_y){
  var height = Math.floor((Math.random() * 2) + 2);
  var a = [
    {x: (base_x - 1), y: (base_y + height)},
    {x: (base_x + 1), y: (base_y + height)}
  ];
  for (var i = 0; i < height; i += 1){
    a.push({x: (base_x), y: (base_y + i)});
  }
  if (Math.random() < 0.5){
    a.push({x: base_x + 1, y: base_y + height - 1});
  }
  if (Math.random() < 0.5){
    a.push({x: base_x - 1, y: base_y + height - 1});
  }
  if (Math.random() < 0.5){
    a.push({x: base_x, y: base_y + height + 1});
  }
  return a;
};

CS.level1.makeKeep = function(x, y){
  var keep = [
    "                                            ]]]]]]]              ",
    "                                           ]       ]             ",
    "                                          ]         ]            ",
    "]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]         ]]]]]]]]]]]]]",
    "]                                                               ]",
    "]                                                               ]",
    "]                                                               ]",
    "]                                                               ]",
    "]  ]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]                       ]",
    "]  ]     ]                         ]                            ]",
    "]  ]     ]                         ]       ]       ]            ]",
    "]        ]                         ]                            ]",
    "]        ]                         ]                         ]]]]",
    "]]]]]]]]]]                         ]                            ]",
    "]                                  ]]                           ]",
    "]                                  ]             ]]             ]",
    "]       ]]]]]]                                                  ]",
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
      if (keep[i][j] === ']') CS.level1.platforms.push({x: x + j, y: y + i});
    }
  }
};

CS.level1.create = function(){
  // 100 units of trees in both directions
  var max_mountain_dist = 100;
  var mountain_start = Math.floor(Math.random() * max_mountain_dist);
  for (var i = -100 ; i <= mountain_start; i += 1){
    CS.level1.platforms.push({x: i, y: -15});
    var rand = Math.random();
    if (rand < 0.2){
      var tree = CS.level1.makeTree(i, -14);
      for (var j = 0; j < tree.length; j += 1){
        CS.level1.platforms.push(tree[j]);
      }
    }
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
        CS.level1.platforms.push({x: i, y: j  - 15});
      }
    }
  }
  CS.level1.makeKeep(mountain_start + mountain_height, mountain_height - 17);
};

CS.level1.meshes = [];
