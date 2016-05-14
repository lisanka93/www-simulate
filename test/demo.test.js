var demo = require('../src/pages/demo.js')

module.exports = (h, store, test) => {
    
  test('demo', t => {
    t.ok(true, 'cool') 
    t.end()
  })
}
