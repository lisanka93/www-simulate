const tour = require('./pages/tour.js')
const demo = require('./pages/demo.js')
const home = require('./pages/home.js')
const navigation = require('./components/navigation.js')

const demo_data = require('../data/demo.json')
const tour_data = require('../data/tour.json')

console.log(demo_data.events.filter(n => n.type === 'cache_remove'))

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
      var el = demo(h, demo_data.events.reverse(), demo_data.topology.nodes, demo_data.topology.edges)
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
