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

  var event_queue, network, msgs, el 
  
  var start = () => {
    document.querySelector('#vis').innerHTML = ''
    event_queue = clone(events)
    msgs = clone(stages).reverse()
    network = draw(clone(nodes), clone(edges), clone(config))
    Object.keys(handlers).forEach(h => {
      network.event(h, handlers[h]) 
    })
    document.querySelector('#start').innerText = 'Restart'
    el = draw_caption()
    document.querySelector('#vis').appendChild(el)
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
  
  return h`
    <div id='tour'>
      <div class='vis-ctl'>
      <button id='start' onclick=${ start }>Start</button>
      <button onclick=${ update }>Update ${'>'}</button>
      </div>
      <div id='vis'></div>
      ${el}
    </div>
  `
}
