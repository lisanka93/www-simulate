module.exports.network = { 
  element: '#vis'
, setup(nodes, edges) {
    nodes.forEach(n => n.requests = []) 
  }
, node_color(node) {
    return node.requests.length > 0 ? 'red' : 'blue' 
  }
, node_size(node) {
    return node.requests.length > 0 ? '15' : '10'
  }
}

module.exports.events = {
  'request': (ev, nodes, edges) => {
    var node = nodes.filter(n => n.name === ev.node)[0]
    if (!node) return
    node.requests.push({
      id: ev.data_ID
    , loc: ev.node
    })
  }
, 'request_hop': (ev, nodes, edges) => {
    var src = nodes.filter(n => n.name === ev.from_node)[0]
    if (!src) return
   
    src.requests = src.requests.filter(function (r) {
      return r.id !== ev.data_ID
    })
    
    var dst = nodes.filter(n => n.name === ev.to_node)[0]
    if (!dst) return
    dst.requests.push({
      id: ev.data_ID
    , loc: ev.to_node
    })
  }
}
