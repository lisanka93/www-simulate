const tour = require('./pages/tour.js')
const demo = require('./pages/demo.js')
const home = require('./pages/home.js')
const navigation = require('./components/navigation.js')

const data = require('../data/topology_small.json')
const data_big = require('../data/topology.json')
const events_big = require('../data/events_big.json')._results.__reduce__[1]['py/tuple'][0][0]['py/tuple'][1]['EVENT_TIMELINE']['TIMELINE'].map(e => { e.type = e.event_type; return e }).reverse()

const events = [
{
  type: 'request'
, node: data.nodes[0].name
},
{
  type: 'request_hop'
, to_node: data.nodes[1].name
, from_node: data.nodes[0].name
},
{
  type: 'request_hop'
, to_node: data.nodes[2].name
, from_node: data.nodes[1].name
},
{
  type: 'request_hop'
, to_node: data.nodes[3].name
, from_node: data.nodes[2].name
}
].reverse()

var layout = (h, body) => {
  return h`
    <div>
      <h1 id='title'>Simulate</h1>
      ${ navigation(h) }
      ${ body } 
    </div> 
  ` 
}

const router = require('routes')()

const route_table = (h) => {
  return {
    '/': s => {
      return home(h)
    }
  , '/vis': s => {
      var el = demo(h, events_big, data_big.nodes, data_big.edges)
      return layout(h, el)
    }
  , '/wow': s => {
      return layout(h, h`<h2>Wow!</h2>`)
    }
  , '/tour': s => {
      var el = tour(h, events, data.nodes, data.edges)
      return layout(h, el)
    }
  , '/error': s => {
      var el = h`<div class='error'>Error: not found</div>`
      return layout(h, el) 
    }
  }
}

var create_router = (h, store) => {

  var table = route_table(h, store)
  Object.keys(table).forEach(route => {
    router.addRoute(route, table[route]) 
  })

  return router
}

module.exports = create_router
