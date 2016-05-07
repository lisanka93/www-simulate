const tour = require('./pages/tour.js')
const demo = require('./pages/demo.js')
const home = require('./pages/home.js')
const about = require('./pages/about.js')
const compare = require('./pages/compare.js')

const navigation = require('./components/navigation.js')

const demo_data = require('../data/demo.json')

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
    , '/about': s => {
      
      var el = about(h, store, s)
        
      return layout(h, store, el)
    }
  , '/tour': s => {
      var el = tour(h)
      return layout(h, store, el)
    }
  , '/error': s => {
      var el = h`<div class='error'>Error: not found</div>`
      return layout(h, store, el) 
    }
  , '/compare': s => {
      var el = compare(h, store)
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
