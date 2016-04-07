const tour = require('./pages/tour.js')
const demo = require('./pages/demo.js')
const home = require('./pages/home.js')
const navigation = require('./components/navigation.js')

const data_big = require('../data/topology.json')
const events_big = require('../data/events_big.json')._results.__reduce__[1]['py/tuple'][0][0]['py/tuple'][1]['EVENT_TIMELINE']['TIMELINE'].map(e => { e.type = e.event_type; return e }).reverse()

const tour_data = require('../data/tour.json')
const router = require('routes')()

var layout = (h, store, body) => {
  return h`
    <div>
      ${ navigation(h, store) }
      ${ body } 
    </div> 
  ` 
}

const route_table = (h, store) => {
  return {
    '/': s => {
      return home(h, store)
    }
  , '/demo': s => {
      var el = demo(h, events_big, data_big.nodes, data_big.edges)
      return layout(h, store, el)
    }
  , '/wow': s => {
      return layout(h, store, h`<h2>Wow!</h2>`)
    }
  , '/tour': s => {
      var el = tour(h, tour_data.events.reverse(), tour_data.topology.nodes, tour_data.topology.edges)
      return layout(h, store, el)
    }
  , '/error': s => {
      var el = h`<div class='error'>Error: not found</div>`
      return layout(h, store, el) 
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
