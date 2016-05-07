const panes = [
  require('./panes/intro.js')
, require('./panes/motive.js')
, require('./panes/content.js')
]

module.exports = (h, store) => {

  var next = () => {store.dispatch({ type: 'next_pane' })}
  var prev = () => {store.dispatch({ type: 'prev_pane' })}

  var pane = (num) => {

    return h`
    <div>
      <h1>${num}</h1>
      <button onclick=${prev}>Back</button>
      <button onclick=${next}>Next</button>
      ${get_pane(num)(h, store)}
    </div>
    `
  } 
  
  return pane(store.get_state().pane)

}

function get_pane(num) {
  if (panes[num]) return panes[num]
  else return panes[0]
}
