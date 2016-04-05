const hub = require('./events.js')()

module.exports = reducer => {

  var state
  
  if (typeof reducer !== 'function') {
    throw new Error('store(reducer) requires function as arg')
  }
  
  hub.on('dispatch', action => {
    state = reducer(state, action)
    hub.emit('update', state)
  })
  
  return {
    get_state() { return state }
  , dispatch(action) { return hub.emit('dispatch', action) }
  , subscribe(fn) { return hub.on('update', fn) }
  }
}
