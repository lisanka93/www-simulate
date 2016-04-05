const test = require('tape')
const topology = require('js-network-vis').topology

const data = require('../data/topology.json')
const handlers = require('../src/config.js').events

var setup_nodes = (nodes) => {
  nodes.forEach(n => { n.requests = [] }) 
}

var no_requests = (node) => node.requests.length === 0
var has_requests = (node) => node.requests.length > 0
var has_id = id => n => n.name === id

var create_graph = (d, ev) => {
  var g = topology(d.nodes, d.graphs)
  setup_nodes(g.nodes)
  g.event(ev, handlers[ev])
  return g
}

test('event: request', t => {
  
  var graph = create_graph(data, 'request')
  
  t.ok(graph.nodes.every(no_requests), 'all requests empty')
  graph.update({
    type: 'request'
  , from_node: graph.nodes[0].name
  })
  
  var matches = graph.nodes.filter(has_requests)
  
  t.equals(matches.length, 1, 'one node has requests')
  t.equals(matches[0].name, graph.nodes[0].name, 'correct node received request') 
  
  t.end()
})

test('event: request -> err', t => {

  var graph = create_graph(data, 'request')
  
  t.ok(graph.nodes.every(no_requests), 'all request empty')
 
  var id = 'abcdefg'
  var nodes = graph.nodes.filter(has_id(id))
  t.equals(nodes.length, 0, 'no nodes with id ' + id)
  
  graph.update({
    type: 'request'
  , from_node: id
  })
  
  t.ok(graph.nodes.every(no_requests), 'all requests still empty')

  t.end()
})

