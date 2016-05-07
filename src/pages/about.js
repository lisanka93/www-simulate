const panes = require('./about_config.js').panes 
const section = require('./about_config.js').render 

module.exports = (h, store, state) => {

  var change_pane = pane => {
    return () => {
      store.dispatch({ 
        type: 'change_pane'
      , pane: pane 
      }) 
    }
  }

  var activity = pane => {
    return pane === state.pane ? 'active' : 'inactive'
  }

  var pane = (num) => {

    return h`
    <div class='about'>
      <div class='menu'>
        <ul>
        ${Object.keys(panes).map(p => {
          return h`<li><button class=${activity(p)} onclick=${change_pane(p)}>
            ${panes[p].title}
          </button></li>`
        })}
        </ul>
      </div>
      ${section(panes[state.pane || 'intro'])(h, store)}
    </div>
    `
  } 
  
  return pane(store.get_state().pane)

}

function get_pane(num) {
  if (panes[num]) return panes[num]
  else return panes[0]
}
