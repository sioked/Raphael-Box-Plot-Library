
Raphael ->
  options = 
    height : 400
    width  : 750
    margin : 50 #margin on the left and bottom of the chart
    vticks : 15 #number of vertical tickets
    boxwidth : 15

  data = [{"med":"1239.0","size":29,"min":"921.0","upquart":"1504.0","max":"2284.0","loquart":"1098.0","id":97,"title":"M 11 & under"},{"med":"1149.0","size":51,"min":"773.0","upquart":"1323.0","max":"4593.0","loquart":"1046.5","id":99,"title":"M 12-18"},{"med":"1145.0","size":286,"min":"619.0","upquart":"1316.0","max":"3463.0","loquart":"994.5","id":101,"title":"M 19-29"},{"med":"1196.0","size":461,"min":"605.0","upquart":"1442.0","max":"4148.0","loquart":"1012.0","id":103,"title":"M 30-39"},{"med":"1215.5","size":378,"min":"604.0","upquart":"1476.0","max":"3711.0","loquart":"1047.0","id":105,"title":"M 40-49"},{"med":"1256.0","size":223,"min":"695.0","upquart":"1514.0","max":"4050.0","loquart":"1093.5","id":107,"title":"M 50-59"},{"med":"1338.0","size":53,"min":"816.0","upquart":"1726.5","max":"2612.0","loquart":"1106.0","id":109,"title":"M 60-69"},{"med":"1822.0","size":6,"min":"1467.0","upquart":"2080.0","max":"2414.0","loquart":"1585.5","id":111,"title":"M 70+"}]
  # data = [
  #   {
  #     med: 500
  #     min: 200
  #     max: 1000
  #     loquart: 400
  #     upquart: 700
  #     
  #   }]
  
  #Work on this
  window.formatter = formatter = (value, format = "short") ->
    SEC_PER_HR = 60*60
    MIN_PER_HR = 60
    [time, msec] = String(value).split(".")
    hr = Math.floor(time/(SEC_PER_HR))
    time = time % (SEC_PER_HR)
    min = Math.floor(time / MIN_PER_HR)
    time = time % (MIN_PER_HR)
    sec = Math.ceil(time)
    
    pad2 = (number) ->
      return "0#{number}" if number < 10
      return "#{number}"
      
    if format is "long"
      if not hr
        return "#{pad2(min)} min #{pad2(sec)} sec"
      else
        return "#{pad2(hr)} hr #{pad2(min)} min #{pad2(sec)} sec"
    
    if format is "short"
      if not hr
        return "#{pad2(min)}:#{pad2(sec)}"
      else
        return "#{pad2(hr)}:#{pad2(min)}:#{pad2(sec)}"
    
   
  # Set up the graph
  r = boxplot.init('canvas', data, options, formatter)

