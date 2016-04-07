const draw = require('js-network-vis')
const clone = require('clone')
const config = require('../config.js')
const handlers = require('../handlers.js')

module.exports = (h, events, nodes, edges) => {

  var network, event_queue

  var start = () => {
    document.querySelector('#vis').innerHTML = ''
    event_queue = clone(events)
    network = draw(clone(nodes), clone(edges), clone(config))
    Object.keys(handlers).forEach(h => {
      network.event(h, handlers[h]) 
    })
    document.querySelector('#start').innerText = 'Restart'
    setInterval(update, 500)
  }

  var update = () => {
    var ev = events.pop()
    console.log('ev', ev)
    if (!ev) return
    network.update(ev)
  }
  
  return h`
    <div>
      <div class='vis-ctl'>
        <button id='start' onclick=${ start }>Start</button>
      </div>
      <div id='vis'></div>
    </div>
  `
}
