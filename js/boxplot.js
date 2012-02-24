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
        "stroke": "#000",
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
  boxplot.drawLineForValue = function(value, title) {
    var box, box_dims, line, text, ypx;
    ypx = height - margin - yscale * value;
    line = r.path("M" + margin + "," + ypx + "L" + width + "," + ypx);
    line.attr(defaultAttrs);
    text = r.text((width - margin) / 2 + margin, ypx, title);
    text.attr(textAttrs);
    box_dims = text.getBBox();
    box = r.rect(box_dims.x - 1, box_dims.y, box_dims.width + 2, box_dims.height);
    box.toBack();
    line.toBack();
    text.toFront();
    text.attr("fill", "#000");
    box.attr({
      "fill": "#fff",
      "opacity": .85
    });
    return r.reference = line;
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
    var cursor, title;
    cursor = void 0;
    title = void 0;
    return r.canvas.onmousemove = function(e) {
      var y;
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
        cursor.attr({
          opacity: .5
        });
        cursor.attr(defaultAttrs);
        r.elems.push(title = r.text(margin * 1.5, y + 20, boxplot.calculateYValue(y + 3)));
        title.attr(textAttrs);
      }
      return title;
    };
  };
  boxplot.drawData = function(data) {
    var currentMargin, datapoint, xmargin, _fn, _i, _len;
    xmargin = (width - margin) / (data.length + 1);
    yscale = boxplot.calcYScale(data);
    boxwidth = 15;
    currentMargin = xmargin;
    r.ylabels = r.set();
    _fn = function(datapoint) {
      var axis, box, hoverBox, lquart, max, med, medLine, min, rheight, uquart, vertLine, yLabel, ytick;
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
      hoverBox = r.rect(max[0] - boxwidth * 1.5 / 2, max[1], boxwidth * 1.5, min[1] - max[1]);
      hoverBox.attr({
        "stroke": "none",
        "fill": "#F00",
        "fill-opacity": 0
      });
      box.attr({
        fill: Raphael.getColor(),
        'fill-opacity': 1,
        title: datapoint.title,
        stroke: "#333",
        "stroke-width": 0
      });
      r.elems.push(medLine = r.path("M" + (med[0] - boxwidth / 2) + "," + med[1] + "L" + (med[0] + boxwidth / 2) + "," + med[1]));
      medLine.attr(defaultAttrs);
      hoverBox.mouseover(function() {
        console.log("Hovered!");
        box.stop().animate({
          'stroke': "#FFF",
          "stroke-width": 3
        }, 400, 'linear');
        return vertLine.stop().animate({
          'stroke-width': 3,
          'stroke': "#FFF"
        }, 400, 'linear');
      });
      hoverBox.mouseout(function() {
        box.stop().animate({
          'stroke-width': 0
        }, 200, 'linear');
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
