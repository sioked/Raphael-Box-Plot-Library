(function() {
  var data, log, options;
  log = function(text) {
    return console.log(text);
  };
  options = {
    height: 400,
    width: 600,
    margin: 20
  };
  data = [
    {
      title: 'group 1',
      max: 100,
      min: 0,
      med: 50,
      upquart: 75,
      loquart: 25
    }, {
      title: 'group 2',
      max: 200,
      min: 30,
      med: 100,
      upquart: 150,
      loquart: 80
    }, {
      title: 'group 3',
      max: 300,
      min: 80,
      med: 150,
      upquart: 200,
      loquart: 120
    }
  ];
  Raphael(function() {
    var boxwidth, calcYScale, currentMargin, cursor, datapoint, genPoint, height, margin, r, tick, verticals, width, x0, xmargin, y0, yscale, _i, _j, _len, _len2, _ref, _results;
    height = options.height;
    width = options.width;
    margin = options.margin;
    calcYScale = function() {
      var i, scale, ymax, ymin;
      ymax = Math.max.apply(Math, (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          i = data[_i];
          _results.push(i.max);
        }
        return _results;
      })());
      ymin = Math.min.apply(Math, (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          i = data[_i];
          _results.push(i.min);
        }
        return _results;
      })());
      return scale = 1 / ((ymax - ymin) / (height - margin));
    };
    genPoint = function(x, y) {
      return [x + margin, height - margin - y];
    };
    window.r = r = Raphael('canvas', width, height);
    _ref = genPoint(0, 0), x0 = _ref[0], y0 = _ref[1];
    r.path("M" + x0 + ",0L" + x0 + "," + y0 + "L" + width + "," + y0);
    verticals = (function() {
      var _ref2, _results;
      _results = [];
      for (tick = 0, _ref2 = height - margin; 0 <= _ref2 ? tick <= _ref2 : tick >= _ref2; 0 <= _ref2 ? tick++ : tick--) {
        if (tick % 20 === 0) {
          _results.push(tick);
        }
      }
      return _results;
    })();
    for (_i = 0, _len = verticals.length; _i < _len; _i++) {
      tick = verticals[_i];
      r.path("M" + (x0 - 2) + "," + tick + "L" + (x0 + 2) + "," + tick);
    }
    cursor = void 0;
    document.getElementById('canvas').onmousemove = function(e) {
      var y;
      y = e.offsetY;
      if (cursor != null) {
        if (typeof cursor.remove === "function") {
          cursor.remove();
        }
      }
      cursor = void 0;
      if ((0 < y && y < height - margin)) {
        cursor = r.path("M" + 0 + "," + y + "L" + width + "," + y);
        return cursor.attr({
          opacity: .5
        });
      }
    };
    xmargin = (width - 2 * margin) / (data.length + 1);
    yscale = calcYScale();
    boxwidth = 20;
    currentMargin = xmargin;
    _results = [];
    for (_j = 0, _len2 = data.length; _j < _len2; _j++) {
      datapoint = data[_j];
      _results.push((function(datapoint) {
        var axis, box, lquart, max, med, min, rheight, uquart;
        axis = genPoint(currentMargin, 0);
        r.path("M" + axis[0] + "," + (axis[1] - 4) + "L" + axis[0] + "," + (axis[1] + 4));
        min = genPoint(currentMargin, datapoint.min * yscale);
        max = genPoint(currentMargin, datapoint.max * yscale);
        med = genPoint(currentMargin, datapoint.med * yscale);
        uquart = genPoint(currentMargin, datapoint.upquart * yscale);
        lquart = genPoint(currentMargin, datapoint.loquart * yscale);
        rheight = lquart[1] - uquart[1];
        r.path("M" + min[0] + "," + min[1] + "L" + max[0] + "," + max[1]);
        box = r.rect(uquart[0] - boxwidth / 2, uquart[1], boxwidth, rheight);
        r.path("M" + (med[0] - boxwidth / 2) + "," + med[1] + "L" + (med[0] + boxwidth / 2) + "," + med[1]);
        box.attr({
          fill: Raphael.getColor(),
          'fill-opacity': 1,
          title: datapoint.title,
          stroke: ''
        });
        return currentMargin = currentMargin + xmargin;
      })(datapoint));
    }
    return _results;
  });
}).call(this);
