const clone = require('clone')
const draw = require('js-network-vis')

const config = require('../config.js')
const handlers = require('../handlers.js')

// TODO: use real algorithms and data
const algorithms = {
  'hi': require('../../data/demo.json')
, 'ho': require('../../data/tour.json')
}

module.exports = (h, store) => {

  var networks = {}, containers = {}, data = {}, started = false

  function create_network(id) {
    var container = document.querySelector('#' + id)
    container.innerHTML = ''
    data[id] = clone(get_data('#' + id + '_algo'))
    if (data[id]) data[id].events.reverse()
    var c = clone(config)
    c.element = '#' + id
    networks[id] = draw(data[id].topology.nodes, data[id].topology.edges, c)
    Object.keys(handlers).forEach(h => {
      networks[id].event(h, handlers[h])
    })
    return container
  }

  var start = () => {
    if (!started) {
      setInterval(update, 500) 
      started = true
    } else {
      if (containers['left']) containers['left'] = create_network('left')
      if (containers['right']) containers['right'] = create_network('right')
    }
  }

  var update = () => {
    var left_ev, right_ev;
    if (data['left']) left_ev = data['left'].events.pop()
    if (data['right']) right_ev = data['right'].events.pop()
    if (left_ev) networks['left'].update(left_ev)
    if (right_ev) networks['right'].update(right_ev)
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
      <div class='vis-ctl'>
        <button onclick=${start}>Start</button>
      </div>
      ${draw_panel(h, 'left')} 
      ${draw_panel(h, 'right')} 
    </div>
  `
}

// return data associated with selected algorithm
function get_data(id) {
  var sel = document.querySelector(id)
  var algo = (sel || {value: undefined}).value
  return algorithms[algo || 'hi']
}
