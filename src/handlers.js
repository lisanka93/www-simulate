module.exports = {
  'request': (ev, nodes, edges) => {
    var node = nodes.filter(n => n.name.toString() === ev.from_node.toString())[0]
    if (!node) return
    node.requests.push({
      id: ev.data_ID
    , loc: ev.from_node
    })
  }
, 'request_hop': (ev, nodes, edges) => {
    
    var src = nodes.filter(n => { 
      return n.name.toString() === ev.from_node.toString() 
    })[0]
    
    var dst = nodes.filter(n => { return n.name.toString() === ev.to_node.toString() })[0]
    
    if (!src || !dst) { return }
    
    src.requests = src.requests.filter(function (r) {
      return r.id !== ev.data_ID
    })
    dst.requests.push({
      id: ev.data_ID
    , loc: ev.to_node
    })
  }
, 'cache_content': (ev, nodes, edges) => {
  
    var node = nodes.filter(n => { 
      return n.name.toString() === ev.node.toString()
    })[0]
    if (!node) return
    
    node.cache.push({
      id: ev.data_ID
    , loc: ev.node  
    })
  }
, 'cache_remove': (ev, nodes, edges) => {
 
    var node = nodes.filter(n => {
      return n.name.toString() === ev.node.toString()  
    })[0]
    if (!node) return
    
    node.cache = node.cache.filter(c => {
      return c.id !== ev.data_ID  
    })
  }
, 'server_hit': (ev, nodes, edges) => {

    var node = nodes.filter(n => {
      return n.name.toString() === ev.node.toString()
    })[0]
    if (!node) return
    
    node.requests = node.requests.filter(r => {
      return r.id !== ev.data_ID 
    })
    
    node.content.push({
      id: ev.data_ID 
    , cache: false
    , loc: ev.node 
    })
  }
, 'cache_hit': (ev, nodes, edges) => {
    
    var node = nodes.filter(n => {
      return n.name.toString() === ev.node.toString()
    })[0]
    if (!node) return
    
    node.requests = node.requests.filter(r => {
      return r.id !== ev.data_ID 
    })
    
    node.content.push({
      id: ev.data_ID 
    , cache: true
    , loc: ev.node 
    })
  }
, 'content_hop': (ev, nodes, edges) => {
  
    var src = nodes.filter(n => { 
      return n.name.toString() === ev.from_node.toString() 
    })[0]
    
    var dst = nodes.filter(n => { return n.name.toString() === ev.to_node.toString() })[0]
    
    if (!src || !dst) { return }
    
    src.content = src.content.filter(n => {
      return n.id !== ev.data_ID
    })
    
    dst.content.push({
      id: ev.data_ID
    , loc: ev.to_node
    })
  }
}
