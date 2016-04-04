const vis = require('./visualization.js')
const router = require('routes')()
const data = require('./topology_small.json')
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
    '/': s => {
      return h`
        <div>${ navigation(h) } Home!</div> 
      `
    }
  , '/wow': s => {
      return h`
        <div>${ navigation(h) } WOW!</div> 
      `
    }
  , '/vis': s => {
      return h`
        <div>
          ${ navigation(h) } 
          VIS
          ${ vis(h, events, data.nodes, data.edges) } 
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
      <a href='/'><li>Home</li></a>
      <a href='/wow'><li>Wow</li></a>
      <a href='/vis'><li>Vis</li></a>
    </ul>
  `
}
