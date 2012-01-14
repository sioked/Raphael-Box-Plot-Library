log = (text) ->
  console.log text
  
options = 
  height : 400
  width  : 600
  margin : 20
  
data = [
  {
    max : 100
    min : 0
    med : 50
    upquart : 75
    loquart : 25
    
  }, {
    max : 200
    min : 30
    med : 100
    upquart : 150
    loquart : 80
  }, {
    max : 300
    min : 80
    med : 150
    upquart : 200
    loquart : 120
  }
]

Raphael ->
  height = options.height
  width = options.width
  margin = options.margin
  
  # Set up the graph
  window.r = r = Raphael('canvas', width, height)
  r.path "M#{margin},0L#{margin},#{height-margin}L#{width},#{height-margin}"
  verticals = (tick for tick in [0..height-margin] when tick % 20 is 0)
  r.path "M#{margin-2},#{tick}L#{margin+2},#{tick}" for tick in verticals
  horizontals = (tick for tick in [margin..width] when tick % 20 is 0)
  r.path "M#{tick},#{height - margin-2}L#{tick},#{height - margin+2}" for tick in horizontals
  
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

  #Calculate the scale of each pixel on the Y axis
  ymax = Math.max.apply Math, (i.max for i in data)
  log "ymax is #{ymax}"
  ymin = Math.min.apply Math, (i.min for i in data)
  log "ymin is #{ymin}"
  #scale is the number of pixels per data point
  #ymax - ymin = total pieces of data represented
  # divide by number of pixels available = total data per visible pixel
  # inverted to give pixels per data point
  scale = 1 / ((ymax - ymin) / (height-margin))
  #To use, multiply the scale by the number of data points to calculate the offset pixels
  log scale
  
  currentMargin = xmargin + margin 
  for datapoint in data
    do (datapoint) ->
      r.path "M#{currentMargin},#{height - margin - datapoint.min*scale}L#{currentMargin},#{height - margin - datapoint.max*scale}"
      r.path "M#{currentMargin - 5},#{height - margin - datapoint.med*scale}L#{currentMargin + 5},#{height - margin - datapoint.med*scale}"
      currentMargin=currentMargin + xmargin