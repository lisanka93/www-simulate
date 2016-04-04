const tour = require('./tour.js')
const demo = require('./demo.js')
const router = require('routes')()
const data = require('./topology_small.json')
const data_big = require('./topology.json')
const events_big = require('./events_big.json')._results.__reduce__[1]['py/tuple'][0][0]['py/tuple'][1]['EVENT_TIMELINE']['TIMELINE'].map(e => { e.type = e.event_type; return e }).reverse()

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

var route_table = (h, store) => {
  return {
    '/vis': s => {
      return h`
        <div>
        ${ navigation(h) } 
        ${ demo(h, events_big, data_big.nodes, data_big.edges) } 
        </div> 
      `
    }
  , '/wow': s => {
      return h`
        <div>
        ${ navigation(h) } 
        <h2>WOW!</h2>
        </div> 
      `
    }
  , '/tour': s => {
      return h`
        <div>
          ${ navigation(h) } 
          ${ tour(h, events, data.nodes, data.edges) } 
        </div>
      `
    }
  }
}

module.exports = (h, store) => {

  var table = route_table(h, store)
  Object.keys(table).forEach(route => {
    router.addRoute(route, table[route]) 
  })

  return router
}

function navigation(h) {
  return h`
    <ul id='navigation'>
      <a href='/tour'><li>Tour</li></a>
      <a href='/wow'><li>Wow</li></a>
      <a href='/vis'><li>Vis</li></a>
    </ul>
  `
}
