const draw = require('js-network-vis')
const clone = require('clone')
const config = require('../config.js')
const handlers = require('../handlers.js')

module.exports = (h, events, nodes, edges) => {

  var network, event_queue, node_data

  var start = () => {
    var container = document.querySelector('#vis')
    container.innerHTML = ''
    event_queue = clone(events)
    network = draw(clone(nodes), clone(edges), clone(config))
    node_data = draw_node_data()
    network.nodes.on('mouseover', d => {
      h.update(node_data, draw_node_data(d))
    })
    network.nodes.on('mouseout', d => {
      h.update(node_data, draw_node_data())
    })
    Object.keys(handlers).forEach(h => {
      network.event(h, handlers[h]) 
    })
    document.querySelector('#start').innerText = 'Restart'
    document.querySelector('#demo').insertBefore(node_data, container)
    setInterval(update, 500)
  }
  
  var draw_section = (d, section) => {
    
    var title = ''
    if (section.length > 0) {
      title += section[0].toUpperCase()
      title += section.slice(1)
    }
    
    if (d[section].length > 0) {
      return h`<li>
        <h4>${title}</h4>
        <ul id=${section}>
       
          ${d[section].map((s, i) => {
            return h`<li>${i+1}. ID: ${s.id}</li>` 
          })}
        
        </ul>
      </li>`
    }
    return h``
  } 

  var draw_node_data = d => {
    if (d && ['cache','requests','content'].some(s => d[s].length)) {
      return h`<div id='node_data'>
        <ul>
          ${draw_section(d, 'cache')}  
          ${draw_section(d, 'requests')}  
          ${draw_section(d, 'content')}  
        </ul>
      </div>` 
    }
    return h`<div></div>`
  }

  var update = () => {
    var ev = event_queue.pop()
    while (!handlers[ev.type] && event_queue.length > 0) {
      ev = event_queue.pop()
    }
    if (!ev) return
    network.update(ev)
  }
  
  return h`
    <div id='demo'>
      <div class='vis-ctl'>
        <button id='start' onclick=${ start }>Start</button>
      </div>
      <div id='vis'></div>
    </div>
  `
}
