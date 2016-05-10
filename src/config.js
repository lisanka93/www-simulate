// config passed to js-network-vis for configuring visualization details

var get_random_component = function (min, max) {
  var letters = '0123456789abcdef'.split('')
  letters = letters.slice(min, max)
  var c = ''
  for (var i = 0; i < 2; i++) {
    c += letters[Math.floor(Math.random()*letters.length)] 
  }
  return c
}

var get_random_green = function () {
  var c = '#'
  c += get_random_component(0, 5) //red
  c += get_random_component(5, 16) //green
  c += get_random_component(0, 5) //blue
  return c
}

var get_random_blue = function () {
  var c = '#'
  c += get_random_component(0, 5) //red
  c += get_random_component(0, 5) //green
  c += get_random_component(5, 16) //blue
  return c
}

var make_color_palette = function(color_fn) {
  var cs = {}
  return function color(id) {
    if (cs[id]) return cs[id]
    else {
      cs[id] = color_fn()
      return cs[id]
    }
  }
}

var request_colors = make_color_palette(get_random_blue)
var response_colors = make_color_palette(get_random_green)

module.exports = { 
  element: '#vis'
, charge: -300
, friction: 100
, linkDistance: 40
, height: 500
, width: 1000
, setup(nodes, edges) {
    nodes.forEach(n => {
      n.requests = []
      n.cache = []
      n.content = []
    }) 
  }
, node_color(node) {
    if (node.requests.length > 0) {
      return request_colors(node.requests[0])
    } else if (node.content.length > 0) {
      return response_colors(node.content[0])
    } else {
      return 'red' 
    }
  }
, node_size(node) {
    return ((node.cache.length *5)+10).toString()
  }
}
