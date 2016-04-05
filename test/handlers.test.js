const test = require('tape')
const topology = require('js-network-vis').topology

const data = require('../data/topology.json')
const handlers = require('../src/config.js').events

var setup_nodes = (nodes) => {
  nodes.forEach(n => { n.requests = []; n.cache = [] }) 
}

var has = (what) => (node) => { return node[what].length > 0 }
var no = (what) => (node) => { return node[what].length === 0 }

var has_id = id => n => n.name === id
var rand = (l, h) => Math.floor(Math.random() * h) + l

var create_graph = (d, ev) => {
  var g = topology(d.nodes, d.graphs)
  setup_nodes(g.nodes)
  g.event(ev, handlers[ev])
  return g
}

test('event: request', t => {
 
  var e = 'request'
  var graph = create_graph(data, e)
  t.ok(graph.nodes.every(no('requests')), 'all requests empty')
  
  graph.update({
    type: e
  , from_node: graph.nodes[0].name
  })
  
  var matches = graph.nodes.filter(has('requests'))
  
  t.equals(matches.length, 1, 'one node has requests')
  t.equals(matches[0].name, graph.nodes[0].name, 'correct node received request') 
  
  t.end()
})

test('event: request -> err', t => {
  
  var e = 'request'
  var graph = create_graph(data, e)
  t.ok(graph.nodes.every(no('requests')), 'all request empty')
 
  var id = 'abcdefg'
  var nodes = graph.nodes.filter(has_id(id))
  t.equals(nodes.length, 0, 'no nodes with id ' + id)
  
  graph.update({
    type: e
  , from_node: id
  })
  
  t.ok(graph.nodes.every(no('requests')), 'all requests still empty')

  t.end()
})

test('event: request_hop', t => {

  var e = 'request_hop'
  var graph = create_graph(data, e)
  t.ok(graph.nodes.every(no('requests')), 'all requests empty')
  
  var id = 'abcdefg'
  var i = rand(0, graph.nodes.length)
  graph.nodes[i].requests.push({
    id: id
  , loc: graph.nodes[i].name
  })
  
  t.equals(graph.nodes.filter(has('requests')).length, 1,
    'one node has requests')
  t.equals(graph.nodes.filter(has('requests'))[0].name,
    graph.nodes[i].name, 'correct node has request')
   
  var j = rand(0, graph.nodes.length)
  graph.update({
    type: e
  , data_ID: id
  , from_node: graph.nodes[i].name
  , to_node: graph.nodes[j].name
  })
  
  var matches = graph.nodes.filter(has('requests'))
  t.equals(matches.length, 1,
    'one node has requests after update')
  t.equals(matches[0].name, graph.nodes[j].name, 'correct node has request')
 
  t.end()
})

test('event: request_hop -> err', t => {

  var e = 'request_hop'
  var graph = create_graph(data, e)
  t.ok(graph.nodes.every(no('requests')), 'all requests empty')
  
  var id = 'abcdefg'
  var i = rand(0, graph.nodes.length)
  graph.nodes[i].requests.push({
    id: id
  , loc: graph.nodes[i].name
  })

  // id used for data_ID and node.name for convenience
  t.equals(graph.nodes.filter(has_id(id)).length, 0, 
    'no nodes with id ' + id)
    
  graph.update({
    type: e
  , to_node: id
  , from_node: i
  , data_ID: id
  })
 
  t.equals(graph.nodes.filter(has('requests')).length, 1, 
    'one one request in network')
  t.equals(graph.nodes[i].requests.length, 1, 'data not moved')
  
  t.end()
})

test('event: cache_content', t => {

  var e = 'cache_content'
  var graph = create_graph(data, e)
  t.ok(graph.nodes.every(no('cache')), 'all requests have empty cache')
  
  var i = rand(0, graph.nodes.length)
  var id = 'abcdefg' 
  graph.update({
    type: e
  , node: graph.nodes[i].name
  , data_ID: id
  })
 
  var matches = graph.nodes.filter(has('cache'))
  t.equals(matches.length, 1, 'one node has item in cache')
  t.equals(matches[0].name, graph.nodes[i].name, 'correct item stored in cache')
  
  t.end()
})

test('event: cache_content -> err', t => {
  
  var e = 'cache_content'
  var graph = create_graph(data, e)
  t.ok(graph.nodes.every(no('cache')), 'all requests have empty cache')
 
  // using id for both node.name and data_ID for convenience
  var id = 'abcdefg' 
  t.equals(graph.nodes.filter(has_id(id)).length, 0,
    'no node with id ' + id)
  
  graph.update({
    type: e
  , node: id
  , data_ID: id
  })
  
  t.ok(graph.nodes.every(no('cache')), 'all requests have empty cache still') 
  t.end()
})
