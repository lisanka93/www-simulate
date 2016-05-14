// event handlers
// handlers to describe network updates for different event types

function find_node (name, canvas) {
  return canvas.selectAll('circle.node')
  .filter(function(d) {
    return d && d.name && d.name === name  
  })
}

var ORIGINAL_SIZE = 10
var TEMP_RESIZE = 16
var TERMINAL_RESIZE = 14


module.exports = {
  'request': (ev, nodes, edges, network) => {
    var node = nodes.filter(n => n.name.toString() === ev.from_node.toString())[0]
    if (!node) return
    node.requests.push({
      id: ev.data_ID
    , loc: ev.from_node
    })


  var node_reset = network.canvas.selectAll('.node')
    .transition()
      .duration(500)
      .style('fill', function(d) {
          if (d.type == 'router') {
            if (d.cache.length > 0) {
              return 'fuchsia'
            }
            else {
              return 'grey'
            }
          }
          else if (d.type == 'source') {
            return 'fuchsia'
          }
          else if (d.type == 'receiver') {
            return 'dodgerblue'
          }
          return 'yellow'
      })
      /*
      .style('stroke-width', function(d) {
          if (d.type == 'router') {
            return '4'
          }
      })
      */    
    .attr('r', ORIGINAL_SIZE)

    find_node(node.name, network.canvas)  
    .transition()
      .duration(500)
      .style('fill', 'yellow')
      .attr('r', TEMP_RESIZE)    
    .transition()
      .delay(500)
      .duration(500)
      .attr('r', TERMINAL_RESIZE)      
  }
, 'request_hop': (ev, nodes, edges, network) => {
    
    var src = nodes.filter(n => { 
      return n.name.toString() === ev.from_node.toString() 
    })[0]
    
    var dst = nodes.filter(n => { return n.name.toString() === ev.to_node.toString() })[0]
    
    if (!src || !dst) { return }
     
    src.requests = src.requests.filter(function (r) {
      return r.id.toString() !== ev.data_ID.toString()
    })
    
    dst.requests.push({
      id: ev.data_ID
    , loc: ev.to_node
    })
    find_node(dst.name, network.canvas)
    .transition()
      .duration(500)
      .style('fill', function(d) {
        if (d.type == 'source') {
          return 'green'
        }
        else {
          return 'orange'
        }
      })
      .attr('r', TEMP_RESIZE) 
    .transition()
      .delay(500)
      .duration(500)
      .style('fill', function(d) {
        if (d.type == 'source') {
          return 'green'
        }
        else {
          return 'orange'
        }
      })
      .attr('r', TERMINAL_RESIZE)
  }
, 'cache_content': (ev, nodes, edges, network) => {
  
    var node = nodes.filter(n => { 
      return n.name.toString() === ev.node.toString()
    })[0]
    if (!node) return
    
    node.cache.push({
      id: ev.data_ID
    , loc: ev.node  
    })
    find_node(node.name, network.canvas)
    .transition()
      .duration(500)
      .style('fill', 'fuchsia')
      .attr('r', TEMP_RESIZE)
    .transition()
      .duration(500)
      .attr('r', TERMINAL_RESIZE)  
  }
, 'cache_remove': (ev, nodes, edges, network) => {
 
    var node = nodes.filter(n => {
      return n.name.toString() === ev.node.toString()  
    })[0]
    if (!node) return
    
    node.cache = node.cache.filter(c => {
      return c.id !== ev.data_ID  
    })
    find_node(node.name, network.canvas)
    .transition()
      .duration(500)
      .style('fill', 'black')
      .attr('r', TEMP_RESIZE)    
    .transition()
      .delay(500)
      .duration(500)
      .style('fill', 'grey')      
      .attr('r', TERMINAL_RESIZE)  
  }
, 'server_hit': (ev, nodes, edges, network) => {

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
    find_node(node.name, network.canvas)
    .transition()
      .duration(500)
      .style('fill', 'green')
      .attr('r', TEMP_RESIZE)   
    .transition()
      .delay(500)
      .duration(500)
      .attr('r', TERMINAL_RESIZE)
  }
, 'cache_hit': (ev, nodes, edges, network) => {
    
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
    find_node(node.name, network.canvas)
    .transition()
      .duration(500)
      .style('fill', 'green')
      .attr('r', TEMP_RESIZE)   
    .transition()
      .delay(500)
      .duration(500)
      .attr('r', TERMINAL_RESIZE)    
  }
, 'content_hop': (ev, nodes, edges, network) => {
  
    var src = nodes.filter(n => { 
      return n.name.toString() === ev.from_node.toString() 
    })[0]
    
    var dst = nodes.filter(n => { return n.name.toString() === ev.to_node.toString() })[0]
    
    if (!src || !dst) { return }
    
    src.content = src.content.filter(n => {
      return n.id.toString() !== ev.data_ID.toString()
    })
    
    dst.content.push({
      id: ev.data_ID
    , loc: ev.to_node
    })
    find_node(dst.name, network.canvas)
    .transition()
      .duration(500)
      .style('fill', 'greenyellow')
      .attr('r', TEMP_RESIZE)
    .transition()
      .duration(500)
      .style('fill', function(d) {
        if (d.type == 'receiver') {
          return 'green'
        }
        else {
          return 'greenyellow'
        }
      })
      .attr('r', TERMINAL_RESIZE)      

    
  }
, 'request_complete': (ev, nodes, edges, network) => {
    
    var node = nodes.filter(n => { 
      return n.name.toString() === ev.node.toString() 
    })[0]
    if (!node) return
    
    node.content = node.content.filter(n => {
      return n.id !== ev.data_ID 
    })
    find_node(node.name, network.canvas)
    .transition()
      .duration(500)
      .style('fill', 'green')
      .attr('r', TEMP_RESIZE)
    .transition()
      .duration(500)
      .attr('r', TERMINAL_RESIZE)   
  }

, 'suggest': (ev, nodes, edges, network) => {
    
    var node = nodes.filter(n => { 
      return n.name.toString() === ev.node.toString() 
    })[0]
    if (!node) return
    
    node.content = node.content.filter(n => {
      return n.id !== ev.data_ID 
    })
    find_node(node.name, network.canvas)
    .transition()
      .duration(500)
      .style('fill', 'fuchsia')
      .attr('r', TEMP_RESIZE)
    .transition()
      .duration(500)
      .attr('r', TERMINAL_RESIZE)   
  }
, 'cache_lookup_failed': (ev, nodes, edges, network) => {
    
    var node = nodes.filter(n => { 
      return n.name.toString() === ev.node.toString() 
    })[0]
    if (!node) return
    
    node.content = node.content.filter(n => {
      return n.id !== ev.data_ID 
    })
    find_node(node.name, network.canvas)
    .transition()
      .duration(500)
      .style('fill', 'red')
      .attr('r', TEMP_RESIZE)
    .transition()
      .delay(500)
      .duration(500)
      .style('fill', 'red')
      .attr('r', TERMINAL_RESIZE)   
  }    
}
