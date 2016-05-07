const clone = require('clone')
const draw = require('js-network-vis')

const config = require('../config.js')
const handlers = require('../handlers.js')

module.exports = (h, events, nodes, edges) => {
  
  // TODO: select algorithm with drop down
  var event_queue, network, caption, node_data
  
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
    network.nodes.on('click', d => {
      if (d && ['cache','requests','content'].some(s => d[s].length)) {
         
      }
    })
    Object.keys(handlers).forEach(h => {
      network.event(h, handlers[h]) 
    })
    document.querySelector('#start').innerText = 'Restart'
    caption = draw_caption()
    document.querySelector('#tour').insertBefore(node_data, container)
    container.appendChild(caption)
  }
  
  var update = () => {
    var ev = event_queue.pop()
    if (!ev) return
    network.update(ev)
    h.update(caption, draw_caption(ev.caption))
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

  var options = [
    {value: 'hi', name: 'Hello'}
  , {value: 'bye', name: 'Goodbye'}
  ]
  
  var drop_down = (h) => {
    var hi = () => { console.log('selected') }
    return h`<select onchange=${hi}>
      <option selected='true' disabled='disabled'>Choose algorithm</option>
      ${options.map(o => h`<option value=${o.value}>
        ${o.name}
      </option>`)}
    </select>`
  }
  
  return h`
    <div id='tour'>
      <div class='vis-ctl'>
      <button id='start' onclick=${ start }>Start</button>
      <button onclick=${ update }>Next ${'>'}</button>
      </div>
      ${drop_down(h)}
      <div id='vis'></div>
    </div>
  `
}
