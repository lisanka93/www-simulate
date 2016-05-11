module.exports = (h, store, test) => {
    
  var compare = require('../src/pages/compare.js')(h, store)

  function exists(selector, t) {
    var el = compare.querySelector(selector)
    t.ok(el, selector + ' panel rendered')
  }

  test('compare', t => {

    t.equals(compare.className, 'compare', 'component has id #compare')

    exists('#left', t)
    exists('#right', t)
    exists('.stats_panel', t)
    exists('.stats_panel', t)
    exists('#left_algo', t)
    exists('#right_algo', t)
    exists('#left_stats', t)
    exists('#right_stats', t)
      
    t.end()
  })
}
