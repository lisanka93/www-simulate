const h = require('yo-yo')
var store = require('./store.js')(reducer)
const router = require('./router.js')(h, store)

require('catch-links')(window, function (href) {
  store.dispatch({ type: 'change_path', path: href })
})

var app = render({ path: '/' })
document.body.appendChild(app)

function reducer (state, action) { 
  
  if (!state) state = { path: '/' }
  switch(action.type) {
  case 'change_path':
    state.path = action.path
    break
  }  
  return state 
}

store.subscribe(state => {
  h.update(app, render(state))
})

function render(state) {
  var m = router.match(state.path)
  if (!m) return router.match('/error').fn(state)
  else return m.fn(state)
}
