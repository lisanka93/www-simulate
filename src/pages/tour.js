const clone = require('clone')
const draw = require('js-network-vis')

const config = require('../config.js')
const handlers = require('../handlers.js')

const stages = [
  "A request is generated!"
, "The request is passed on"
, "and again"
, "and again..."
, "Server has been reached! Here comes content..."
, "Back along the path it came"
, "Node by node..."
, "Until it's back where it started"
, "Where it is consumed!"
]

module.exports = (h, events, nodes, edges) => {

  var event_queue, network, msgs, el, node_data
  
  var start = () => {
    var container = document.querySelector('#vis')
    container.innerHTML = ''
    event_queue = clone(events)
    msgs = clone(stages).reverse()
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
    el = draw_caption()
    document.querySelector('#tour').insertBefore(node_data, container)
    container.appendChild(el)
  }
  
  var update = () => {
    var ev = event_queue.pop()
    var msg = msgs.pop()
    if (!ev) return
    network.update(ev)
    h.update(el, draw_caption(msg))
  }
 
  var draw_caption = m => {
    if (m) {
      return h`<div id='caption'><p>${m}</p></div>`
    }
    return h`<div></div>`
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
  
  return h`
    <div id='tour'>
      <div class='vis-ctl'>
      <button id='start' onclick=${ start }>Start</button>
      <button onclick=${ update }>Next ${'>'}</button>
      </div>
      <div id='vis'></div>
      ${el}
    </div>
  `
}
