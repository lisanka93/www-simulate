module.exports = (h, store) => {

  var next = () => {store.dispatch({ type: 'next_pane' })}
  var prev = () => {store.dispatch({ type: 'prev_pane' })}

  var pane = (num) => {
    return h`
    <div>
        <h1>${num}</h1>
        <button onclick=${prev}>Back</button>
        <button onclick=${next}>Next</button>
    </div>
    `
  } 
  
  return pane(store.get_state().pane)

}
