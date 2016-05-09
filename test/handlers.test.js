const test = require('tape')
const topology = require('js-network-vis').topology

const data = require('../data/topology.json')
const handlers = require('../src/handlers.js')

var setup_nodes = (nodes) => {
  nodes.forEach(n => { 
    n.requests = [] 
    n.cache = [] 
    n.content = []
  }) 
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
  t.ok(graph.nodes.every(no('cache')), 'all caches have empty cache')
 
  // using id for both node.name and data_ID for convenience
  var id = 'abcdefg' 
  t.equals(graph.nodes.filter(has_id(id)).length, 0,
    'no node with id ' + id)
  
  graph.update({
    type: e
  , node: id
  , data_ID: id
  })
  
  t.ok(graph.nodes.every(no('cache')), 'all caches have empty cache still') 
  t.end()
})

test('event: cache_remove', t => {

  var e = 'cache_remove'
  var graph = create_graph(data, e)
  t.ok(graph.nodes.every(no('cache')), 'all nodes have empty cache')
  
  var i = rand(0, graph.nodes.length)
  var id = 'abcdefg'
  graph.nodes[i].cache.push({
    id: id
  , loc: graph.nodes[i].name
  })
  
  t.equals(graph.nodes.filter(has('cache'))[0].name, 
    graph.nodes[i].name, 'correct node has item in cache')
  
  graph.update({
    type: e
  , data_ID: id
  , node: graph.nodes[i].name
  })
  
  t.ok(graph.nodes.every(no('cache')), 'all nodes have empty cache')

  t.end()
})

test('event: cache_remove -> err', t => {

  var e = 'cache_remove'
  var graph = create_graph(data, e)
  
  var i = rand(0, graph.nodes.length)
  var id = 'abcdefg'
  graph.nodes[i].cache.push({
    id: id
  , loc: graph.nodes[i].name
  })
  
  t.equals(graph.nodes.filter(has('cache'))[0].name, 
    graph.nodes[i].name, 'correct node has item in cache')
 
  var n_id = 'gfedcba'
  t.equals(graph.nodes.filter(has_id(id)).length, 0,
    'no nodes with id ' + id)
  graph.update({
    type: e
  , data_ID: id
  , node: n_id
  })
  
  t.equals(graph.nodes.filter(has('cache'))[0].name, 
    graph.nodes[i].name, 'same node has item in cache')
  t.equals(graph.nodes.filter(has('cache')).length, 1,
    'only one cached item in network')

  t.end()
})


test('event: server_hit', t => {
  
  var e = 'server_hit'
  var graph = create_graph(data, e)
  
  t.ok(graph.nodes.every(no('content')), 'no requests in network')

  var i = rand(0, graph.nodes.length)
  var id = 'abcdefg'
  graph.nodes[i].requests.push({
    id: id
  , loc: graph.nodes[i].name
  })
 
  var matches = graph.nodes.filter(has('requests'))
  t.equals(matches.length, 1, 'one node has requests')
  t.equals(matches[0].name, graph.nodes[i].name, 'correct node')
  
  graph.update({
    type: e 
  , node: graph.nodes[i].name
  , data_ID: id
  })
  
  t.ok(graph.nodes.every(no('requests')), 'no requests in network')
  matches = graph.nodes.filter(has('content'))
  t.equals(matches.length, 1, 'one node has content')
  t.equals(matches[0].name, graph.nodes[i].name, 
    'content exists at server')
  t.equals(matches[0].content.length, 1, 'one piece of content')
  t.notOk(matches[0].content[0].cache, 'not cached content')
 
  t.end()
})

test('event: server_hit -> err', t => {

  var e = 'server_hit'
  var graph = create_graph(data, e)
  
  t.ok(graph.nodes.every(no('content')), 'no requests in network')

  var i = rand(0, graph.nodes.length)
  var id = 'abcdefg'
  graph.nodes[i].requests.push({
    id: id
  , loc: graph.nodes[i].name
  })
 
  var matches = graph.nodes.filter(has('requests'))
  t.equals(matches.length, 1, 'one node has requests')
  t.equals(matches[0].name, graph.nodes[i].name, 'correct node')

  var n_id = 'easonuahsh'
  t.equals(graph.nodes.filter(has_id(n_id)).length, 0,
    'no nodes with id ' + n_id)
  graph.update({
    type: e 
  , node: n_id
  , data_ID: id
  })
  
  matches = graph.nodes.filter(has('requests'))
  t.equals(matches.length, 1, 'one node has requests still')
  t.equals(matches[0].name, graph.nodes[i].name, 'same node')
 
  t.ok(graph.nodes.every(no('content')), 'no node has content')
 
  t.end()
})

test('event: cache_hit', t => {
  
  var e = 'cache_hit'
  var graph = create_graph(data, e)
  
  t.ok(graph.nodes.every(no('content')), 'no requests in network')

  var i = rand(0, graph.nodes.length)
  var id = 'abcdefg'
  graph.nodes[i].requests.push({
    id: id
  , loc: graph.nodes[i].name
  })
 
  var matches = graph.nodes.filter(has('requests'))
  t.equals(matches.length, 1, 'one node has request')
  t.equals(matches[0].name, graph.nodes[i].name, 'correct node')
  
  graph.update({
    type: e
  , data_ID: id
  , node: graph.nodes[i].name
  })
  
  t.ok(graph.nodes.every(no('requests')), 'no requests in network')
 
  matches = graph.nodes.filter(has('content'))
  t.equals(matches.length, 1, 'one node has content')
  t.equals(matches[0].name, graph.nodes[i].name, 'correct node')
  t.equals(matches[0].content.length, 1, 'one piece of content')
  t.ok(matches[0].content[0].cache, 'content from cache')
  /*
   * create request at server
   * check request exists
   * update with cache_hit
   * check no requests
   * cehck content exists at server
   * */

  t.end()
})

test('event: content_hop', t => {

  var e = 'content_hop'
  var graph = create_graph(data, e)
 
  var i = rand(0, graph.nodes.length)
  var id = 'abcdefg'
  graph.nodes[i].content.push({
    id: id
  , loc: graph.nodes[i].name
  })
 
  var matches = graph.nodes.filter(has('content'))
  t.equals(matches.length, 1, 'one node has content')
  t.equals(matches[0].name, graph.nodes[i].name, 'correct node')
 
  var j = rand(0, graph.nodes.length)
  graph.update({
    type: e
  , from_node: graph.nodes[i].name
  , to_node: graph.nodes[j].name
  , data_ID: id
  })
  
  matches = graph.nodes.filter(has('content'))
  t.equals(matches.length, 1, 'one node has content')
  t.equals(matches[0].name, graph.nodes[j].name, 'correct node')
  
  t.end()
})

test('event: request_complete', t => {

  var e = 'request_complete'
  var graph = create_graph(data, e)
  
  var i = rand(0, graph.nodes.length)
  var id = 'abcdefg'
  graph.nodes[i].content.push({
    id: id
  , loc: graph.nodes[i].name 
  })
  
  var matches = graph.nodes.filter(has('content'))
  t.equals(matches.length, 1, 'one node has content')
  t.equals(matches[0].name, graph.nodes[i].name, 'correct node')
  
  graph.update({
    type: e
  , node: graph.nodes[i].name
  , data_ID: id
  })
  
  t.ok(graph.nodes.every(no('content')), 'no nodes have content')
  t.end()
})

test('event: request_complete -> err', t => {

  var e = 'request_complete'
  var graph = create_graph(data, e)
  
  var i = rand(0, graph.nodes.length)
  var id = 'abcdefg'
  graph.nodes[i].content.push({
    id: id
  , loc: graph.nodes[i].name 
  })
  
  var matches = graph.nodes.filter(has('content'))
  t.equals(matches.length, 1, 'one node has content')
  t.equals(matches[0].name, graph.nodes[i].name, 'correct node')

  // use id for node and data for convenience
  t.equals(graph.nodes.filter(has_id(id)).length, 0, 
    'no nodes with id ' + id)
  graph.update({
    type: e
  , node: id
  , data_ID: id
  })
  
  var matches = graph.nodes.filter(has('content'))
  t.equals(matches.length, 1, 'one node has still content')
  t.equals(matches[0].name, graph.nodes[i].name, 'correct node')
  
  t.end()
})
