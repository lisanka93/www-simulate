var test = require('tape')
var h = require('yo-yo')
var store = require('../src/store.js')((state, action) => {
  return state
})

//require('./navigation.test.js')(h, store, test)
//require('./home.test.js')(h, store, test)
//require('./compare.test.js')(h, store, test)
require('./about.test.js')(h, store, test)
//require('./demo.test.js')(h, store, test)
//require('./tour.test.js')(h, store, test)
//require('./router.test.js')(h, store, test)

test('end', t => {
  t.end()
  window.close()
})
