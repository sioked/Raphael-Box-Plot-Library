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
      max: 100,
      min: 0,
      med: 50,
      upquart: 75,
      loquart: 25
    }, {
      max: 200,
      min: 30,
      med: 100,
      upquart: 150,
      loquart: 80
    }, {
      max: 300,
      min: 80,
      med: 150,
      upquart: 200,
      loquart: 120
    }
  ];
  Raphael(function() {
    var currentMargin, cursor, datapoint, height, horizontals, i, margin, r, scale, tick, verticals, width, xmargin, ymax, ymin, _i, _j, _k, _len, _len2, _len3, _results;
    height = options.height;
    width = options.width;
    margin = options.margin;
    window.r = r = Raphael('canvas', width, height);
    r.path("M" + margin + ",0L" + margin + "," + (height - margin) + "L" + width + "," + (height - margin));
    verticals = (function() {
      var _ref, _results;
      _results = [];
      for (tick = 0, _ref = height - margin; 0 <= _ref ? tick <= _ref : tick >= _ref; 0 <= _ref ? tick++ : tick--) {
        if (tick % 20 === 0) {
          _results.push(tick);
        }
      }
      return _results;
    })();
    for (_i = 0, _len = verticals.length; _i < _len; _i++) {
      tick = verticals[_i];
      r.path("M" + (margin - 2) + "," + tick + "L" + (margin + 2) + "," + tick);
    }
    horizontals = (function() {
      var _results;
      _results = [];
      for (tick = margin; margin <= width ? tick <= width : tick >= width; margin <= width ? tick++ : tick--) {
        if (tick % 20 === 0) {
          _results.push(tick);
        }
      }
      return _results;
    })();
    for (_j = 0, _len2 = horizontals.length; _j < _len2; _j++) {
      tick = horizontals[_j];
      r.path("M" + tick + "," + (height - margin - 2) + "L" + tick + "," + (height - margin + 2));
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
    ymax = Math.max.apply(Math, (function() {
      var _k, _len3, _results;
      _results = [];
      for (_k = 0, _len3 = data.length; _k < _len3; _k++) {
        i = data[_k];
        _results.push(i.max);
      }
      return _results;
    })());
    log("ymax is " + ymax);
    ymin = Math.min.apply(Math, (function() {
      var _k, _len3, _results;
      _results = [];
      for (_k = 0, _len3 = data.length; _k < _len3; _k++) {
        i = data[_k];
        _results.push(i.min);
      }
      return _results;
    })());
    log("ymin is " + ymin);
    scale = 1 / ((ymax - ymin) / (height - margin));
    log(scale);
    currentMargin = xmargin + margin;
    _results = [];
    for (_k = 0, _len3 = data.length; _k < _len3; _k++) {
      datapoint = data[_k];
      _results.push((function(datapoint) {
        r.path("M" + currentMargin + "," + (height - margin - datapoint.min * scale) + "L" + currentMargin + "," + (height - margin - datapoint.max * scale));
        r.path("M" + (currentMargin - 5) + "," + (height - margin - datapoint.med * scale) + "L" + (currentMargin + 5) + "," + (height - margin - datapoint.med * scale));
        return currentMargin = currentMargin + xmargin;
      })(datapoint));
    }
    return _results;
  });
}).call(this);
