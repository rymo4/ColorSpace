window.CS = window.CS || {};
CS.level1 = CS.level1 || {};

CS.level1.platforms = [
  /*{x: 0, y: -10},
  {x: 1, y: -10},
  {x: 2, y: -10},
  {x: 3, y: -10},
  {x: 4, y: -10},
  {x: 5, y: -10},
  {x: 6, y: -10},
  {x: 7, y: -10},
  {x: 8, y: -10},
  {x: 9, y: -10},
  {x: 10, y: -10},
  {x: 11, y: -10},

  {x: 10, y: -7},
  {x: 9, y: -7},
  {x: 8, y: -7},
  {x: 7, y: -7},
  {x: 6, y: -7},
  {x: 5, y: -7},
  {x: 11, y: -7},
  {x: 12, y: -7},
  {x: 13, y: -7},
  {x: 14, y: -7},
  {x: 15, y: -7},

  {x: 12, y: -4},
  {x: 13, y: -4},
  {x: 14, y: -4},
  {x: 15, y: -4},

  {x: 0, y: 0},
  {x: 1, y: 0},
  {x: 2, y: 0},
  {x: 3, y: 0},
  {x: 4, y: 0},
  {x: 5, y: 0},
  {x: 6, y: 0},

  {x: 15, y: 0},
  {x: 16, y: 0},
  {x: 17, y: 0},
  {x: 18, y: 0},
  {x: 19, y: 0},
  {x: 20, y: 0},

  {x: 10, y: 3},
  {x: 11, y: 3},
  {x: 12, y: 3},
  {x: 13, y: 3},
  {x: 14, y: 3},
  {x: 15, y: 3}*/
];
CS.level1.tree = function(base_x, base_y){
  var a = [
    {x: base_x, y: base_y},
    {x: base_x, y: (base_y + 1)},
    {x: base_x, y: (base_y + 2)},
    {x: (base_x - 1), y: (base_y + 2)},
    {x: (base_x + 1), y: (base_y + 2)}
  ];
  if (Math.random() < 0.5){
    a.push({x: base_x, y: base_y + 3});
  }
  if (Math.random() < 0.5){
    a.push({x: base_x + 1, y: base_y + 3});
  }
  if (Math.random() < 0.5){
    a.push({x: base_x - 1, y: base_y + 3});
  }
  return a;
};

CS.level1.makeKeep = function(x, y){
  var keep = [
    "]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]          ]]]]]]]]]]]]]",
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
      var tree = CS.level1.tree(i, -14);
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
