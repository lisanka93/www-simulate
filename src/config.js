module.exports = { 
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
