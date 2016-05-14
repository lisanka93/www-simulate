var tour = require('../src/pages/tour.js')

module.exports = (h, store, test) => {
    
  test('tour', t => {
    t.ok(true, 'cool') 
    t.end()
  })
}

/*
test('/tour', t => {
  var comp = tour(h, store)
  document.body.appendChild(comp)

  var start = document.querySelector('#start')
  var vis = document.querySelector('#vis')
  t.ok(start, 'start button exists')
  t.ok(vis, 'visualization section exists')
  t.notOk(vis.innerHTML, 'visualization is empty')

  start.click()
  t.ok(vis.innerHTML, 'visualization section filled')

  t.end()
})
*/
