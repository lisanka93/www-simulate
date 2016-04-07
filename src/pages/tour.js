const clone = require('clone')
const draw = require('js-network-vis')

const config = require('../config.js')
const handlers = require('../handlers.js')

module.exports = (h, events, nodes, edges) => {

  var event_queue, network
  
  var start = () => {
    document.querySelector('#vis').innerHTML = ''
    event_queue = clone(events)
    network = draw(clone(nodes), clone(edges), clone(config))
    Object.keys(handlers).forEach(h => {
      network.event(h, handlers[h]) 
    })
    document.querySelector('#start').innerText = 'Restart'
  }
  
  var update = () => {
    var ev = event_queue.pop()
    if (!ev) return
    network.update(ev)
  }
  
  return h`
    <div id='tour'>
      <div class='vis-ctl'>
      <button id='start' onclick=${ start }>Start</button>
      <button onclick=${ update }>Update ${'>'}</button>
      </div>
      <div id='vis'></div>
    </div>
  `
}
