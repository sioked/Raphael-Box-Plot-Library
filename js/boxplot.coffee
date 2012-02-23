## Global private variables:
height = 0 #overall height of the canvas
width = 0 #overall width of the canvas
margin = 0 #Margin on bottom and left
vticks = 0 #Number of vertical ticks to display
boxwidth = 0 #width of each individual box
r = undefined
boxplot = window.boxplot ||= {}

## Global private functions
log = (text) ->
  console.log text

genPoint = (x, y) ->
  # Generate point based on x-y coordinates (raphael calculates y in upper left corner) 
  return [x + margin, height - margin - y]

boxplot.init = (location, data, options) ->
  throw new Error("Raphael.js must be included before building the graph") unless Raphael
  height = options.height || 600
  width = options.width || 800
  margin = options.margin || 40
  vticks = options.vticks || 15
  boxwidth = options.boxwidth || 15
  canvas = location
  
  r = Raphael(location, width, height)
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
  scale = 1 / ((ymax - 0) / (height-margin))
  # scale * datapoint = pixels 
  #To use, multiply the scale by the number of data points to calculate the offset pixels
  
boxplot.drawAxes = (r, data, options) ->
  [x0,y0] = genPoint(0,0)
  vheight = height - margin
  vtickpx = Math.round(vheight / vticks)
  scale = boxplot.calcYScale(data)
  r.path "M#{x0},0L#{x0},#{y0}L#{width},#{y0}"
  verticals = (tick for tick in [0..vheight] when tick % vtickpx is 0)
  for tick in verticals
    #tick is in pixels
    do (tick) ->
      r.path "M#{x0-2},#{tick}L#{x0+2},#{tick}"
      point = genPoint(0, tick) 
      r.text margin/2, point[1], Math.round(tick/scale*10)/10
  r
  
boxplot.horizontalHover = ->
  # Set up the hover effect line
  cursor = undefined;
  r.canvas.onmousemove = (e)->
    y = e.offsetY
    cursor?.remove?()
    cursor = undefined
    if 0 < y < height - margin
      cursor = r.path "M#{0},#{y+3}L#{width},#{y+3}"
      cursor.attr {opacity:.5}
      
boxplot.drawData = (data) ->
  # Add a line for min & max
  # First calculate where on the x-axis to put it
  # Actual width divided by # of margins (if 2 data points, 3 margins)
  xmargin = (width - 2*margin)/(data.length + 1)
  yscale = boxplot.calcYScale(data)
  boxwidth = 15    
  currentMargin = xmargin 
  for datapoint in data
    do (datapoint) ->
      #First, set the point on the x axis
      axis = genPoint( currentMargin, 0);
      r.path "M#{axis[0]},#{axis[1]-4}L#{axis[0]},#{axis[1]+4}"
      r.text axis[0], axis[1] + margin/2, datapoint.title
      
      min = genPoint(currentMargin, datapoint.min * yscale)
      max = genPoint(currentMargin, datapoint.max * yscale)
      med = genPoint(currentMargin, datapoint.med * yscale)
      uquart = genPoint(currentMargin, datapoint.upquart * yscale)
      lquart = genPoint(currentMargin, datapoint.loquart * yscale)
      rheight = lquart[1] - uquart[1]
      r.path "M#{min[0]},#{min[1]}L#{max[0]},#{max[1]}"
      box = r.rect uquart[0]-boxwidth/2, uquart[1], boxwidth, rheight
      #Display the median line on Top of the box
      r.path "M#{med[0] - boxwidth/2},#{med[1]}L#{med[0] + boxwidth/2},#{med[1]}"
      box.attr { fill: Raphael.getColor(), 'fill-opacity': 1, title: datapoint.title, stroke : "#333", "stroke-width": 0 }
      # Cool effects, but not really working well
      box.mouseover ->
        box.stop().animate { 'stroke-width': 2}, 200, 'linear'
      box.mouseout ->
        box.stop().animate { 'stroke-width': 0 }, 200, 'linear'
      currentMargin=currentMargin + xmargin
