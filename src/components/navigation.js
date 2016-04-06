const routes = require('../route_config.js')

var list_item = (h, path) => (r) => {
  if (r === path) return
  return h`
    <li class='solid'>
      <a href=${r}>${routes[r].title}</a>
      <div class='solid' id='description'>
        <h2>${routes[r].title}</h2>
        <p>${routes[r].description}</p> 
      </div>
    </li>
  `
}

module.exports = (h, store) => {
  
  var current = (store.get_state() || {path: '/'}).path
  var els = Object.keys(routes).map(list_item(h, current))
   
  return h`
    <ul id='navigation'>
      ${els}
    </ul>
  `
}
