log = (text) ->
  console.log text
  
options = 
  height : 400
  width  : 600
  margin : 40 #margin on the left and bottom of the chart
  vticks : 15 #number of vertical tickets
  
data = [
  {
    title : 'group 1'
    max : 10
    min : 2
    med : 5
    upquart : 7.5
    loquart : 2.5
    
  }, {
    title : 'group 2'
    max : 20
    min : 3
    med : 10
    upquart : 15
    loquart : 8
  }, {
    title : 'group 3'
    max : 30
    min : 8
    med : 15
    upquart : 20
    loquart : 12
  }
]

Raphael ->
  height = options.height
  width = options.width
  margin = options.margin
  vticks = options.vticks

  calcYScale = ->
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
  
  
  genPoint = (x, y) ->
    # Generate point based on x-y coordinates (raphael calculates y in upper left corner) 
    return [x + margin, height - margin - y]
    
  # Set up the graph
  window.r = r = Raphael('canvas', width, height)
  [x0,y0] = genPoint(0,0)
  vheight = height - margin
  vtickpx = Math.round(vheight / vticks)
  scale = calcYScale()
  #[xmax, ymax] = genPoint(1,1)
  r.path "M#{x0},0L#{x0},#{y0}L#{width},#{y0}"
  verticals = (tick for tick in [0..height-margin] when tick % vtickpx is 0)
  for tick in verticals
    #tick is in pixels
    do (tick) ->
      r.path "M#{x0-2},#{tick}L#{x0+2},#{tick}"
      point = genPoint(0, tick) 
      r.text margin/2, point[1], Math.round(tick/scale*10)/10
  # horizontals = (tick for tick in [margin..width] when tick % 20 is 0)
  # r.path "M#{tick},#{y0-2}L#{tick},#{y0+2}" for tick in horizontals
  
  # Set up the hover effect line
  cursor = undefined;
  document.getElementById('canvas').onmousemove = (e)->
    y = e.offsetY
    cursor?.remove?()
    cursor = undefined
    if 0 < y < height - margin
      cursor = r.path "M#{0},#{y}L#{width},#{y}"
      cursor.attr {opacity:.5}
      
  # Add a line for min & max
  # First calculate where on the x-axis to put it
  # Actual width divided by # of margins (if 2 data points, 3 margins)
  xmargin = (width - 2*margin)/(data.length + 1)

  yscale = calcYScale()
  boxwidth = 30    
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
      box.attr { fill: Raphael.getColor(), 'fill-opacity': 1, title: datapoint.title, stroke: '' }
      # Cool effects, but not really working well
      # box.mouseover -> 
      #         box.stop().animate {'stroke-width': 3}, 200, 'linear'
      #       box.mouseout ->
      #         box.stop().animate { 'stroke-width': '' }, 200, 'linear'
      currentMargin=currentMargin + xmargin