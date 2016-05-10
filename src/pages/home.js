const nav = require('../components/navigation.js')
const data = require('../../data/tour_simple.json').topology
const draw = require('js-network-vis')
const clone = require('clone')
const config = require('../config.js')

module.exports = (h, store) => {
  
  var conf = clone(config)
  
  var load = () => {
    var el = document.querySelector('#background')
    var network
    if (!el) {
      setTimeout(load, 200)
    } else {
      conf.element = '#background'
      conf.linkDistance = '150'
      conf.height = '500'
      conf.width = '1000'
      conf.charge = '-300'
      conf.node_size = '25'
      network = draw(clone(data.nodes), clone(data.edges), conf)
      network.event('add', (ev, nodes, edges) => {
        ev.nodes.forEach(node => {
          nodes.push(node)
        })
        ev.edges.push(edge => {
          edges.push(edge) 
        })
      })
    }
  }
  
  load()

  return h`
    <div id='home'>
      <h1 onload=${ load } id='title'>Simulate</h1>
      ${ nav(h, store) }
      
      <div class='overlay'></div>
      <div id='background'></div>
    </div>
  ` 
}
