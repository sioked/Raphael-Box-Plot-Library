## Global private variables:
height = 0 #overall height of the canvas
width = 0 #overall width of the canvas
margin = 0 #Margin on bottom and left
vticks = 0 #Number of vertical ticks to display
boxwidth = 0 #width of each individual box
r = {}
yscale = undefined
ymax = undefined
formatter = undefined
boxplot = window.boxplot = {}
graph = window.graph = []
defaultAttrs = {}
textAttrs = {}

## Global private functions
log = (text) ->
  console.log text

genPoint = (x, y) ->
  # Generate point based on x-y coordinates (raphael calculates y in upper left corner) 
  return [x + margin, height - margin - y]

boxplot.init = (location, data, options, valueFormatter) ->
  throw new Error("Raphael.js must be included before building the graph") unless Raphael
  formatter = valueFormatter || null
  elem = if typeof location is "string" then document.getElementById(location) else location
  elem.innerHTML = ""
  height = options.height || 600
  width = options.width || 800
  margin = options.margin || 40
  vticks = options.vticks || 15
  boxwidth = options.boxwidth || 15
  defaultAttrs = options.defaultAttrs || [
    "stroke" : "#000"
    "stroke-width": "1"
  ]
  textAttrs = options.textAttrs || [
    "fill" : "#000"
    "font-size" : 10
  ]
  canvas = location
  
  r = boxplot.r = Raphael(location, width, height)
  r.elems = r.set()
  boxplot.drawAxes(r, data)
  boxplot.horizontalHover()
  boxplot.drawData(data)
  r #return the raphael object
  
boxplot.calcYScale = (data) ->
  #Calculate the scale of each pixel on the Y axis
  ymax = Math.max.apply Math, (i.max for i in data)
  #ymin = Math.min.apply Math, (i.min for i in data)
  #scale is the number of pixels per data point
  #ymax - ymin = total pieces of data represented
  # divide by number of pixels available = total data per visible pixel
  # inverted to give pixels per data point
  scale = yscale = 1 / ((ymax - 0) / (height-margin))
  scale
  # scale * datapoint = pixels 
  #To use, multiply the scale by the number of data points to calculate the offset pixels

boxplot.calculateYValue = (ypx) ->
  # Pixels / scale = datapoint
  value = Math.round((ymax - ypx/yscale)*10)/10
  return formatter(value) if formatter
  return value
  
boxplot.formatValue = (value) ->
  return formatter(value) if formatter
  return value
  
boxplot.drawLineForValue = (value, title) ->
  r.setStart()
  ypx = height - margin - yscale * value
  text = r.text 1.7*margin, ypx, title
  text.attr textAttrs
  box_dims = text.getBBox()
  line = r.path "M#{margin},#{ypx}L#{box_dims.x-1},#{ypx}M#{box_dims.x + box_dims.width+1},#{ypx}L#{width},#{ypx}"
  line.attr defaultAttrs
  line.attr {"stroke-width" : 2}
  line.toBack()
  r.reference = r.setFinish()

boxplot.drawAxes = (r, data, options) ->
  [x0,y0] = genPoint(0,0)
  vheight = height - margin #(600-20 = 580)
  vtickpx = Math.round(vheight / vticks) #(580/15 = 39) 
  scale = boxplot.calcYScale(data)
  r.elems.push axes = r.path "M#{x0},0L#{x0},#{y0}L#{width},#{y0}"
  axes.attr defaultAttrs
  verticals = (tick for tick in [0..vheight] when tick % vtickpx is 0)
  for tick in verticals
    #tick is in pixels
    do (tick) ->
      r.elems.push tickElem = r.path "M#{x0-2},#{tick}L#{x0+2},#{tick}"
      r.elems.push tickText = r.text margin/2, tick, boxplot.calculateYValue(tick) unless tick - vtickpx < 0
      tickElem.attr defaultAttrs
      tickText?.attr textAttrs
  
boxplot.horizontalHover = ->
  # Set up the hover effect line
  cursor = undefined
  title = undefined
  interval = 0
  r.canvas.onmousemove = (e)->
    interval = 0
    y = e.offsetY
    cursor?.remove?()
    title?.remove?()
    cursor = undefined
    title = undefined
    if 0 < y < height - margin
      r.elems.push cursor = r.path "M#{0},#{y+3}L#{width},#{y+3}"
      cursor.attr defaultAttrs
      cursor.attr {opacity:.5}
      r.elems.push title = r.text margin*1.5, y+20, boxplot.calculateYValue(y+3)
      title.attr textAttrs
    title
  setInterval( ->
    if interval > 2
      cursor?.stop().animate {opacity: 0}, 500, 'linear'
      title?.stop().animate {opacity: 0}, 500, 'linear'
    else
      interval += 1
  , 1000)
  r  

boxplot.drawData = (data) ->
  # Add a line for min & max
  # First calculate where on the x-axis to put it
  # Actual width divided by # of margins (if 2 data points, 3 margins)
  xmargin = (width - margin)/(data.length + 1)
  yscale = boxplot.calcYScale(data)
  boxwidth = 15    
  currentMargin = xmargin
  r.ylabels = r.set() 
  for datapoint in data
    do (datapoint) ->
      #First, set the point on the x axis
      axis = genPoint( currentMargin, 0);
      r.elems.push ytick = r.path "M#{axis[0]},#{axis[1]-4}L#{axis[0]},#{axis[1]+4}"
      r.ylabels.push yLabel = r.text axis[0], axis[1] + margin/2, datapoint.title
      ytick.attr defaultAttrs
      yLabel.attr textAttrs
      
      min = genPoint(currentMargin, datapoint.min * yscale)
      max = genPoint(currentMargin, datapoint.max * yscale)
      med = genPoint(currentMargin, datapoint.med * yscale)
      uquart = genPoint(currentMargin, datapoint.upquart * yscale)
      lquart = genPoint(currentMargin, datapoint.loquart * yscale)
      rheight = lquart[1] - uquart[1]
      r.elems.push vertLine = r.path "M#{min[0]},#{min[1]}L#{max[0]},#{max[1]}"
      vertLine.attr defaultAttrs
      r.elems.push box = r.rect uquart[0]-boxwidth/2, uquart[1], boxwidth, rheight
      hoverBox = r.rect max[0]-boxwidth*5/2, max[1], boxwidth*4, min[1]-max[1]
      hoverBox.attr {"stroke":"none", "fill":"#F00", "fill-opacity":0}
      box.attr defaultAttrs
      box.attr { fill: Raphael.getColor(), 'fill-opacity': 1, title: datapoint.title, "stroke-width": 1 }
      #Display the median line on Top of the box
      r.elems.push medLine = r.path "M#{med[0] - boxwidth/2},#{med[1]}L#{med[0] + boxwidth/2},#{med[1]}"
      medLine.attr defaultAttrs
      
      r.setStart()
      offset = 18
      r.text uquart[0]+offset, uquart[1], "Top 75%\n#{boxplot.formatValue(datapoint.upquart)}"
      r.text lquart[0]+offset, lquart[1], "Top 25%\n#{boxplot.formatValue(datapoint.loquart)}"
      if max[1]-20 < 0 then voffset = 10 else voffset = -10
      console.log max[1], height  
      r.text max[0]+offset, max[1]+voffset, "Slowest:\n#{boxplot.formatValue(datapoint.max)}"
      r.text min[0]+offset, min[1]+10, "Fastest:\n#{boxplot.formatValue(datapoint.min)}"
      titles = r.setFinish()
      titles.attr {fill: "#FFF", "font-size":10, "text-anchor": "start", opacity: 0}
      
      referenceLine = r.reference?.getPointAtLength(0)
      
      hoverBox.mouseover ->
        r.reference?.animate {'opacity': 0}, 400, 'linear'
        titles.stop().animate { 'opacity': 1 }, 400, 'linear'
        box.stop().animate { 'stroke': "#FFF", "stroke-width":2}, 400, 'linear'
        vertLine.stop().animate {'stroke-width' : 2}, 400, 'linear'
      hoverBox.mouseout ->
        r.reference?.animate {'opacity': 1}, 400, 'linear'
        titles.stop().animate { 'opacity': 0 }, 400, 'linear'
        box.stop().animate { 'stroke-width': 1 }, 400, 'linear'
        vertLine.stop().animate {'stroke-width' : 1}, 400, 'linear'
      
      currentMargin=currentMargin + xmargin
      currentMargin
  r
