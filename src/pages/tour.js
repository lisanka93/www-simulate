const clone = require('clone')
const draw = require('js-network-vis')

const config = require('../config.js')
const handlers = require('../handlers.js')

module.exports = (h, events, nodes, edges) => {

  var network
  
  var start = () => {
    if (network) return
    network = draw(clone(nodes), clone(edges), clone(config))
    Object.keys(handlers).forEach(h => {
      network.event(h, handlers[h]) 
    }) 
  }

  var update = () => {
    var ev = events.pop()
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
