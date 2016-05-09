var test = require('tape')
var h = require('yo-yo')
var store = require('../src/store.js')((state, action) => {
  return state
})

var navigation = require('../src/components/navigation.js')
/*
  var m = router.match(state.path)
  if (!m) return router.match('/error').fn(state)
  else return m.fn(state)
*/

test('/', t => {

  var el = navigation(h, store)
  document.body.appendChild(el)
  
  ;['tour','demo'].forEach(id => {
    var button = document.querySelector('#' + id)
    t.ok(button, id + ' button exists')
  })
  
  t.end()
})

test('/tour', t => {
  var el = navigation(h, store)

test('end', t => {
  
  t.end()
  window.close()
})
