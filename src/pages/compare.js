const clone = require('clone')
const draw = require('js-network-vis')

const config = require('../config.js')
const handlers = require('../handlers.js')

const algorithms = {
  'hi': require('../../data/demo.json')
, 'ho': require('../../data/tour.json')
}


module.exports = (h, store) => {

  // TODO: create a shared start button that 
  // triggers both at once

  var networks = {}, containers = {}

  function create_network(id) {
    var container = document.querySelector('#' + id)
    container.innerHTML = ''
    var d = clone(get_data('#' + id + '_algo'))
    var c = clone(config)
    c.element = '#' + id
    networks[id] = draw(d.topology.nodes, d.topology.edges, c)
    Object.keys(handlers).forEach(h => {
      networks[id].event(h, handlers[h])
    })
    return container
  }

  var start = () => {
    // TODO: start animation
  }

  var change_algo = (id) => {
    return () => { containers[id] = create_network(id) }
  }

  var drop_down = (h, id) => {
      
    return h`<select onchange=${change_algo(id)} id=${id+'_algo'}>
      <option selected='true' disabled='disabled'>Choose algorithm</option>
      <option value='hi'>Hello</option>
      <option value='ho'>Bye</option>
    </select>`
  }

  var draw_panel= (h, id) => {
    return h`<div class='panel'>
      ${drop_down(h, id)}
      <div id=${id}></div>
    </div>`
  }

    
  return h`
    <div class='compare'>
      <button onclick=${start}>start</button>
      ${draw_panel(h, 'left')} 
      ${draw_panel(h, 'right')} 
    </div>
  `
}

function get_data(id) {
  var sel = document.querySelector(id)
  var algo = (sel || {value: undefined}).value
  return algorithms[algo || 'hi']
}

