(function() {
  var data, log, options;
  log = function(text) {
    return console.log(text);
  };
  options = {
    height: 400,
    width: 600,
    margin: 40,
    vticks: 15
  };
  data = [
    {
      title: 'group 1',
      max: 10,
      min: 2,
      med: 5,
      upquart: 7.5,
      loquart: 2.5
    }, {
      title: 'group 2',
      max: 20,
      min: 3,
      med: 10,
      upquart: 15,
      loquart: 8
    }, {
      title: 'group 3',
      max: 30,
      min: 8,
      med: 15,
      upquart: 20,
      loquart: 12
    }
  ];
  Raphael(function() {
    var boxwidth, calcYScale, currentMargin, cursor, datapoint, genPoint, height, margin, r, scale, tick, verticals, vheight, vtickpx, vticks, width, x0, xmargin, y0, yscale, _fn, _i, _j, _len, _len2, _ref, _results;
    height = options.height;
    width = options.width;
    margin = options.margin;
    vticks = options.vticks;
    calcYScale = function() {
      var i, scale, ymax;
      ymax = Math.max.apply(Math, (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          i = data[_i];
          _results.push(i.max);
        }
        return _results;
      })());
      return scale = 1 / ((ymax - 0) / (height - margin));
    };
    genPoint = function(x, y) {
      return [x + margin, height - margin - y];
    };
    window.r = r = Raphael('canvas', width, height);
    _ref = genPoint(0, 0), x0 = _ref[0], y0 = _ref[1];
    vheight = height - margin;
    vtickpx = Math.round(vheight / vticks);
    scale = calcYScale();
    r.path("M" + x0 + ",0L" + x0 + "," + y0 + "L" + width + "," + y0);
    verticals = (function() {
      var _ref2, _results;
      _results = [];
      for (tick = 0, _ref2 = height - margin; 0 <= _ref2 ? tick <= _ref2 : tick >= _ref2; 0 <= _ref2 ? tick++ : tick--) {
        if (tick % vtickpx === 0) {
          _results.push(tick);
        }
      }
      return _results;
    })();
    _fn = function(tick) {
      var point;
      r.path("M" + (x0 - 2) + "," + tick + "L" + (x0 + 2) + "," + tick);
      point = genPoint(0, tick);
      return r.text(margin / 2, point[1], Math.round(tick / scale * 10) / 10);
    };
    for (_i = 0, _len = verticals.length; _i < _len; _i++) {
      tick = verticals[_i];
      _fn(tick);
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
        r.text(axis[0], axis[1] + margin / 2, datapoint.title);
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
