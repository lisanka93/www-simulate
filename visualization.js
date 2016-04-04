const draw = require('js-network-vis')
const config = require('./config.js')

module.exports = (h, events, nodes, edges) => {

  var network

  var start = () => {
    console.log('start')
    network = draw(nodes, edges, config.network)
    Object.keys(config.events).forEach(e => {
      network.event(e, config.events[e]) 
    }) 
  }

  var update = () => {
    var ev = events.pop()
    if (!ev) return
    network.update(ev)
  }
  
  return h`
    <div>
      <div class='vis-ctl'>
      <button onclick=${ start }>Start</button>
      <button onclick=${ update }>Update ${'>'}</button>
      </div>
      <div id='vis'></div>
    </div>
  `
}
