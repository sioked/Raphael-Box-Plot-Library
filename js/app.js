(function() {
  Raphael(function() {
    var data, options, r;
    options = {
      height: 600,
      width: 1100,
      margin: 40,
      vticks: 15,
      boxwidth: 15
    };
    data = [
      {
        "med": "1297.5",
        "title": "Male 11 & Under",
        "upquart": "1617.0",
        "max": "2788.0",
        "min": "50.0",
        "loquart": "1148.5"
      }, {
        "med": "1366.0",
        "title": "Female 11 & Under",
        "upquart": "1657.5",
        "max": "2750.0",
        "min": "925.0",
        "loquart": "1256.0"
      }, {
        "med": "1148.5",
        "title": "Male 12-18",
        "upquart": "1269.0",
        "max": "2287.0",
        "min": "767.0",
        "loquart": "1012.0"
      }, {
        "med": "1430.0",
        "title": "Female 12-18",
        "upquart": "1845.0",
        "max": "2817.0",
        "min": "744.0",
        "loquart": "1222.0"
      }, {
        "med": "1127.0",
        "title": "Male 19-29",
        "upquart": "1339.0",
        "max": "3447.0",
        "min": "639.0",
        "loquart": "1011.0"
      }, {
        "med": "1399.0",
        "title": "Female 19-29",
        "upquart": "1676.5",
        "max": "3436.0",
        "min": "773.0",
        "loquart": "1210.0"
      }, {
        "med": "1182.0",
        "title": "Male 30-39",
        "upquart": "1427.5",
        "max": "4117.0",
        "min": "572.0",
        "loquart": "1036.0"
      }, {
        "med": "1418.0",
        "title": "Female 30-39",
        "upquart": "1732.0",
        "max": "3615.0",
        "min": "758.0",
        "loquart": "1189.5"
      }, {
        "med": "1223.5",
        "title": "Male 40-49",
        "upquart": "1459.0",
        "max": "3385.0",
        "min": "718.0",
        "loquart": "1052.0"
      }, {
        "med": "1452.0",
        "title": "Female 40-49",
        "upquart": "1842.0",
        "max": "5762.0",
        "min": "677.0",
        "loquart": "1206.0"
      }, {
        "med": "1270.0",
        "title": "Male 50-59",
        "upquart": "1542.0",
        "max": "5439.0",
        "min": "697.0",
        "loquart": "1107.0"
      }, {
        "med": "1568.0",
        "title": "Female 50-59",
        "upquart": "2019.5",
        "max": "4330.0",
        "min": "1006.0",
        "loquart": "1311.0"
      }, {
        "med": "1366.0",
        "title": "Male 60-69",
        "upquart": "1669.0",
        "max": "2786.0",
        "min": "906.0",
        "loquart": "1139.0"
      }, {
        "med": "1621.5",
        "title": "Female 60-69",
        "upquart": "2059.0",
        "max": "5208.0",
        "min": "994.0",
        "loquart": "1397.0"
      }
    ];
    return r = boxplot.init('canvas', data, options);
  });
}).call(this);
