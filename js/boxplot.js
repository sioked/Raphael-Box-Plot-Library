(function() {
  var boxplot, boxwidth, defaultAttrs, formatter, genPoint, graph, height, log, margin, r, textAttrs, vticks, width, ymax, yscale;
  height = 0;
  width = 0;
  margin = 0;
  vticks = 0;
  boxwidth = 0;
  r = {};
  yscale = void 0;
  ymax = void 0;
  formatter = void 0;
  boxplot = window.boxplot = {};
  graph = window.graph = [];
  defaultAttrs = {};
  textAttrs = {};
  log = function(text) {
    return console.log(text);
  };
  genPoint = function(x, y) {
    return [x + margin, height - margin - y];
  };
  boxplot.init = function(location, data, options, valueFormatter) {
    var canvas, elem;
    if (!Raphael) {
      throw new Error("Raphael.js must be included before building the graph");
    }
    formatter = valueFormatter || null;
    elem = typeof location === "string" ? document.getElementById(location) : location;
    elem.innerHTML = "";
    height = options.height || 600;
    width = options.width || 800;
    margin = options.margin || 40;
    vticks = options.vticks || 15;
    boxwidth = options.boxwidth || 15;
    defaultAttrs = options.defaultAttrs || [
      {
        "stroke": "#000",
        "stroke-width": "1"
      }
    ];
    textAttrs = options.textAttrs || [
      {
        "fill": "#000",
        "font-size": 10
      }
    ];
    canvas = location;
    r = boxplot.r = Raphael(location, width, height);
    r.elems = r.set();
    boxplot.drawAxes(r, data);
    boxplot.horizontalHover();
    boxplot.drawData(data);
    return r;
  };
  boxplot.calcYScale = function(data) {
    var i, scale;
    ymax = Math.max.apply(Math, (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        i = data[_i];
        _results.push(i.max);
      }
      return _results;
    })());
    scale = yscale = 1 / ((ymax - 0) / (height - margin));
    return scale;
  };
  boxplot.calculateYValue = function(ypx) {
    var value;
    value = Math.round((ymax - ypx / yscale) * 10) / 10;
    if (formatter) {
      return formatter(value);
    }
    return value;
  };
  boxplot.formatValue = function(value) {
    if (formatter) {
      return formatter(value);
    }
    return value;
  };
  boxplot.drawLineForValue = function(value, title) {
    var box_dims, line, text, ypx;
    r.setStart();
    ypx = height - margin - yscale * value;
    text = r.text(1.7 * margin, ypx, title);
    text.attr(textAttrs);
    box_dims = text.getBBox();
    line = r.path("M" + margin + "," + ypx + "L" + (box_dims.x - 1) + "," + ypx + "M" + (box_dims.x + box_dims.width + 1) + "," + ypx + "L" + width + "," + ypx);
    line.attr(defaultAttrs);
    line.attr({
      "stroke-width": 2
    });
    line.toBack();
    return r.reference = r.setFinish();
  };
  boxplot.drawAxes = function(r, data, options) {
    var axes, scale, tick, verticals, vheight, vtickpx, x0, y0, _i, _len, _ref, _results;
    _ref = genPoint(0, 0), x0 = _ref[0], y0 = _ref[1];
    vheight = height - margin;
    vtickpx = Math.round(vheight / vticks);
    scale = boxplot.calcYScale(data);
    r.elems.push(axes = r.path("M" + x0 + ",0L" + x0 + "," + y0 + "L" + width + "," + y0));
    axes.attr(defaultAttrs);
    verticals = (function() {
      var _results;
      _results = [];
      for (tick = 0; 0 <= vheight ? tick <= vheight : tick >= vheight; 0 <= vheight ? tick++ : tick--) {
        if (tick % vtickpx === 0) {
          _results.push(tick);
        }
      }
      return _results;
    })();
    _results = [];
    for (_i = 0, _len = verticals.length; _i < _len; _i++) {
      tick = verticals[_i];
      _results.push((function(tick) {
        var tickElem, tickText;
        r.elems.push(tickElem = r.path("M" + (x0 - 2) + "," + tick + "L" + (x0 + 2) + "," + tick));
        if (!(tick - vtickpx < 0)) {
          r.elems.push(tickText = r.text(margin / 2, tick, boxplot.calculateYValue(tick)));
        }
        tickElem.attr(defaultAttrs);
        return tickText != null ? tickText.attr(textAttrs) : void 0;
      })(tick));
    }
    return _results;
  };
  boxplot.horizontalHover = function() {
    var cursor, interval, title;
    cursor = void 0;
    title = void 0;
    interval = 0;
    r.canvas.onmousemove = function(e) {
      var y;
      interval = 0;
      y = e.offsetY;
      if (cursor != null) {
        if (typeof cursor.remove === "function") {
          cursor.remove();
        }
      }
      if (title != null) {
        if (typeof title.remove === "function") {
          title.remove();
        }
      }
      cursor = void 0;
      title = void 0;
      if ((0 < y && y < height - margin)) {
        r.elems.push(cursor = r.path("M" + 0 + "," + (y + 3) + "L" + width + "," + (y + 3)));
        cursor.attr(defaultAttrs);
        cursor.attr({
          opacity: .5
        });
        r.elems.push(title = r.text(margin * 1.5, y + 20, boxplot.calculateYValue(y + 3)));
        title.attr(textAttrs);
      }
      return title;
    };
    setInterval(function() {
      if (interval > 2) {
        if (cursor != null) {
          cursor.stop().animate({
            opacity: 0
          }, 500, 'linear');
        }
        return title != null ? title.stop().animate({
          opacity: 0
        }, 500, 'linear') : void 0;
      } else {
        return interval += 1;
      }
    }, 1000);
    return r;
  };
  boxplot.drawData = function(data) {
    var currentMargin, datapoint, xmargin, _fn, _i, _len;
    xmargin = (width - margin) / (data.length + 1);
    yscale = boxplot.calcYScale(data);
    boxwidth = 15;
    currentMargin = xmargin;
    r.ylabels = r.set();
    _fn = function(datapoint) {
      var axis, box, hoverBox, lquart, max, med, medLine, min, offset, referenceLine, rheight, titles, uquart, vertLine, voffset, yLabel, ytick, _ref;
      axis = genPoint(currentMargin, 0);
      r.elems.push(ytick = r.path("M" + axis[0] + "," + (axis[1] - 4) + "L" + axis[0] + "," + (axis[1] + 4)));
      r.ylabels.push(yLabel = r.text(axis[0], axis[1] + margin / 2, datapoint.title));
      ytick.attr(defaultAttrs);
      yLabel.attr(textAttrs);
      min = genPoint(currentMargin, datapoint.min * yscale);
      max = genPoint(currentMargin, datapoint.max * yscale);
      med = genPoint(currentMargin, datapoint.med * yscale);
      uquart = genPoint(currentMargin, datapoint.upquart * yscale);
      lquart = genPoint(currentMargin, datapoint.loquart * yscale);
      rheight = lquart[1] - uquart[1];
      r.elems.push(vertLine = r.path("M" + min[0] + "," + min[1] + "L" + max[0] + "," + max[1]));
      vertLine.attr(defaultAttrs);
      r.elems.push(box = r.rect(uquart[0] - boxwidth / 2, uquart[1], boxwidth, rheight));
      hoverBox = r.rect(max[0] - boxwidth * 5 / 2, max[1], boxwidth * 4, min[1] - max[1]);
      hoverBox.attr({
        "stroke": "none",
        "fill": "#F00",
        "fill-opacity": 0
      });
      box.attr(defaultAttrs);
      box.attr({
        fill: Raphael.getColor(),
        'fill-opacity': 1,
        title: datapoint.title,
        "stroke-width": 1
      });
      r.elems.push(medLine = r.path("M" + (med[0] - boxwidth / 2) + "," + med[1] + "L" + (med[0] + boxwidth / 2) + "," + med[1]));
      medLine.attr(defaultAttrs);
      r.setStart();
      offset = 18;
      r.text(uquart[0] + offset, uquart[1], "Top 75%\n" + (boxplot.formatValue(datapoint.upquart)));
      r.text(lquart[0] + offset, lquart[1], "Top 25%\n" + (boxplot.formatValue(datapoint.loquart)));
      if (max[1] - 20 < 0) {
        voffset = 10;
      } else {
        voffset = -10;
      }
      console.log(max[1], height);
      r.text(max[0] + offset, max[1] + voffset, "Slowest:\n" + (boxplot.formatValue(datapoint.max)));
      r.text(min[0] + offset, min[1] + 10, "Fastest:\n" + (boxplot.formatValue(datapoint.min)));
      titles = r.setFinish();
      titles.attr({
        fill: "#FFF",
        "font-size": 10,
        "text-anchor": "start",
        opacity: 0
      });
      referenceLine = (_ref = r.reference) != null ? _ref.getPointAtLength(0) : void 0;
      hoverBox.mouseover(function() {
        var _ref2;
        if ((_ref2 = r.reference) != null) {
          _ref2.animate({
            'opacity': 0
          }, 400, 'linear');
        }
        titles.stop().animate({
          'opacity': 1
        }, 400, 'linear');
        box.stop().animate({
          'stroke': "#FFF",
          "stroke-width": 2
        }, 400, 'linear');
        return vertLine.stop().animate({
          'stroke-width': 2
        }, 400, 'linear');
      });
      hoverBox.mouseout(function() {
        var _ref2;
        if ((_ref2 = r.reference) != null) {
          _ref2.animate({
            'opacity': 1
          }, 400, 'linear');
        }
        titles.stop().animate({
          'opacity': 0
        }, 400, 'linear');
        box.stop().animate({
          'stroke-width': 1
        }, 400, 'linear');
        return vertLine.stop().animate({
          'stroke-width': 1
        }, 400, 'linear');
      });
      currentMargin = currentMargin + xmargin;
      return currentMargin;
    };
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      datapoint = data[_i];
      _fn(datapoint);
    }
    return r;
  };
}).call(this);
