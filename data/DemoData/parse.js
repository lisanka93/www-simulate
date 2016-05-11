var data = require('./POP_NEIGHBOUR_DYN_clean_events.json')


var obj = {}
obj.events = data['EVENTS']
obj.topology = {}
obj.topology.nodes = data['TOPOLOGY']['NODES']
obj.topology.edges = data['TOPOLOGY']['EDGES']

console.log(JSON.stringify(obj))
