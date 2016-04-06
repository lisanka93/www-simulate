const routes = require('../route_config.js')

var list_item = (route) => {

}

module.exports = h => {

  var els = Object.keys(routes).map(r => {
    return h`
      <li class='solid'>
        <a href=${r}>${routes[r].title}</a>
        <div class='solid' id='description'>
        <h2>${routes[r].title}</h2>
        <p>${routes[r].description}</p> 
      </div></li>
    ` 
  })
   
  return h`
    <ul id='navigation'>
      ${els}
    </ul>
  `
}
