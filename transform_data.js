/* FINISH PARSING NODES AND EDGES  AND EVENTS */

var data = require('./data/events_big.json')
var t = require('./data/demo.json')

var d = data._results.__reduce__[1]['py/tuple'][0][0]['py/tuple'][1]

var events = d['EVENT_TIMELINE']['TIMELINE']
var topology = d['TOPOLOGY']['TOPOLOGY']

//console.log(topology)
var nodes = (Object.keys(t.nodes).map(k => {
  
  var node = {}
  node.name = k
  node.type = t.nodes[k]['py/tuple'][0]
  return node
}))
