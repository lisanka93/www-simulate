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
    var node = nodes.filter(n => n.name.toString() === ev.from_node.toString())[0]
    if (!node) return
    node.requests.push({
      id: ev.data_ID
    , loc: ev.from_node
    })
  }
, 'request_hop': (ev, nodes, edges) => {
    var src = nodes.filter(n => n.name.toString() === ev.from_node.toString())[0]
    if (!src) return
   
    src.requests = src.requests.filter(function (r) {
      return r.id !== ev.data_ID
    })
    
    var dst = nodes.filter(n => n.name.toString() === ev.to_node.toString())[0]
    if (!dst) return
    dst.requests.push({
      id: ev.data_ID
    , loc: ev.to_node
    })
  }
}
