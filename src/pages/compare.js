const clone = require('clone')
const draw = require('js-network-vis')

const config = require('../config.js')
const handlers = require('../handlers.js')

// TODO: use real algorithms and data
const algorithms = {
  'pop_neighbour_dyn': require('../../data/demos/formatted_POP_NEIGHBOUR_DYN_clean_events.json')
, 'pop_neighbour_stat': require('../../data/demos/formatted_POP_NEIGHBOUR_STAT_clean_events.json')
, 'pop_neighbour_t_dyn': require('../../data/demos/formatted_POP_NEIGHBOUR_T_DYN_clean_events.json')
, 'pop_neighbour_t_stat': require('../../data/demos/formatted_POP_NEIGHBOUR_T_STAT_clean_events.json')
, 'pop_self_dyn': require('../../data/demos/formatted_POP_SELF_DYN_clean_events.json')
, 'pop_self_stat': require('../../data/demos/formatted_POP_SELF_STAT_clean_events.json')
}

module.exports = (h, store) => {

  var networks = {}, containers = {}, data = {}, started = false
  var stats = { 'left': {}, 'right': {} }
  var stats_panel = draw_stats()

  function update_stats(panel, event) {
    stats[panel][event.type] = !stats[panel][event.type] ? 1 
          : stats[panel][event.type] += 1;
    h.update(stats_panel, draw_stats())
  }

  function single_stat(name, val) {
    if (val) {
	if(val%1 != 0){
	    val = val.toFixed(3);
	}
      return h`
        <p><strong>${name}: </strong>${val} </p>
      `
    } else {
      return h``
    }
  }
  function single_stats_panel (panel) {
  
    var s = stats[panel]
    var avg_hops_per_request = s['request_hop']/s['request']
    var cache_hit_ratio = s['cache_hit']/s['server_hit']
    return h`<div class='single_stats_panel' id=${panel + '_stats'}>
      ${single_stat('Hops', s['request_hop'])}
      ${single_stat('Requests', s['request'])}
      ${single_stat('Avg hops/request', avg_hops_per_request)}
      ${single_stat('Cache hits', s['cache_hit'])}
      ${single_stat('Server hits', s['server_hit'])}
      ${single_stat('Cache hits/Server hits', cache_hit_ratio)}
    </div>` 
  }

  function draw_stats() {
    return h`<div class='stats_panel'>
      ${single_stats_panel('left')}
      ${single_stats_panel('right')}
    </div>`
  }

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
    stats = { 'left': {}, 'right': {} }
    h.update(stats_panel, draw_stats())
    if (!started) {
      setInterval(update, 150) 
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
    if (left_ev) {
      networks['left'].update(left_ev)
      update_stats('left', left_ev)
    }
    if (right_ev) {
      networks['right'].update(right_ev)
      update_stats('right', right_ev)
    }
  }

  var change_algo = (id) => {
    return () => { containers[id] = create_network(id) }
  }

  var drop_down = (h, id) => {
    return h`<select onchange=${change_algo(id)} id=${id+'_algo'}>
      <option selected='true' disabled='disabled'>Choose algorithm</option>
      <option value='pop_neighbour_dyn'>PopNeighDyn</option>
      <option value='pop_neighbour_stat'>PopNeighStat</option>
      <option value='pop_neighbour_t_dyn'>PopNeighTDyn</option>
      <option value='pop_neighbour_t_stat'>PopNeighTStat</option>
      <option value='pop_self_dyn'>PopSelfDyn</option>
      <option value='pop_self_stat'>PopSelfStat</option>
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
      ${stats_panel}
    </div>
  `
}

// return data associated with selected algorithm
function get_data(id) {
  var sel = document.querySelector(id)
  var algo = (sel || {value: undefined}).value
  return algorithms[algo || 'hi']
}
