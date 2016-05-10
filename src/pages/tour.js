const clone = require('clone')
const draw = require('js-network-vis')

const config = require('../config.js')
const handlers = require('../handlers.js')

// TODO: add other algorithms
const data = {
  'one': require('../../data/tour.json')
, 'simple': require('../../data/tour_simple.json')
, 'accept': require('../../data/tour_acceptance.json')
, 'nosuggest': require('../../data/tour_no_suggestion.json')
}

module.exports = (h) => {
  
  var event_queue, network, caption, node_data

  // return network and event data corresponding to selected algorithm 
  var get_data = () => {
    var sel = document.querySelector('#algo')
    var algo = (sel || {value: 'one'}).value
    return data[algo] || data['one']
  }
 
  var start = () => {
    var s_data = get_data()
    var container = document.querySelector('#vis')
    container.innerHTML = ''
    event_queue = clone(s_data.events).reverse()
    network = draw(clone(s_data.topology.nodes), clone(s_data.topology.edges), clone(config))
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
    var interval, last_type
    var ev = event_queue.pop()

    interval = setInterval(() => {
      network.update(ev)
      h.update(caption, draw_caption(ev.caption))
      last_type = ev.type === 'request' ? 'request_hop' 
            : ev.type === 'server_hit' ? 'content_hop'
            : ev.type
      ev = event_queue.pop() 
      if (!ev || ev.type !== last_type) {
        clearInterval(interval)
        if (!ev) return
        else event_queue.push(ev)
      }
    }, 500)
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
        <h5>Node: ${d.ref}</h5>
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
    {value: 'one', name: 'Hello'}
  , {value: 'simple', name: 'Simple'}
  , {value: 'accept', name: 'Acceptance Threshold'}
  , {value: 'nosuggest', name: 'No Suggestion'}
  ]
  
  var drop_down = (h) => {
    var hi = () => { console.log('selected') }
    return h`<select onchange=${hi} id='algo'>
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
